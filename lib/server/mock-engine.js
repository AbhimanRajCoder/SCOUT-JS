/**
 * Built-in Mock Server Engine for SCOUT-JS.
 * Generates deterministic, schema-compliant mock responses from OpenAPI 3.1 definitions.
 * Follows Principle 3: Never fabricate schemas or arbitrary hallucinated examples.
 */

/**
 * Generates a mock payload strictly conforming to a JSON Schema definition.
 * 
 * @param {Object} schema 
 * @returns {any}
 */
export function generateMockFromSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return null;
  }

  // 1. Explicit example defined on schema
  if (schema.example !== undefined) {
    return schema.example;
  }

  // 2. Default value defined on schema
  if (schema.default !== undefined) {
    return schema.default;
  }

  // 3. Enum value
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }

  // 4. Object type
  if (schema.type === 'object' || schema.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(schema.properties || {})) {
      obj[key] = generateMockFromSchema(prop);
    }
    return obj;
  }

  // 5. Array type
  if (schema.type === 'array') {
    return [generateMockFromSchema(schema.items || {})];
  }

  // 6. String type with formats
  if (schema.type === 'string') {
    if (schema.format === 'email') return 'user@example.com';
    if (schema.format === 'date-time') return '2026-01-01T00:00:00.000Z';
    if (schema.format === 'date') return '2026-01-01';
    if (schema.format === 'uuid') return '00000000-0000-0000-0000-000000000000';
    if (schema.format === 'uri' || schema.format === 'url') return 'https://example.com';
    return 'string';
  }

  // 7. Number and Integer types
  if (schema.type === 'number' || schema.type === 'integer') {
    return schema.minimum !== undefined ? schema.minimum : 0;
  }

  // 8. Boolean type
  if (schema.type === 'boolean') {
    return true;
  }

  return null;
}

/**
 * Converts an OpenAPI path with {param} placeholders into a regular expression.
 * 
 * @param {string} openApiPath 
 * @returns {{ regex: RegExp, paramNames: string[] }}
 */
export function pathToRegExp(openApiPath) {
  const paramNames = [];
  const regexStr = '^' + openApiPath
    .replace(/[.*+?^${}()|[\]\\]/g, (match) => {
      if (match === '{' || match === '}') return match;
      return '\\' + match;
    })
    .replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    }) + '/?$';
  return { regex: new RegExp(regexStr, 'i'), paramNames };
}

/**
 * Finds a matching route in the registry for a given HTTP method and path.
 * 
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {string} method 
 * @param {string} targetPath 
 * @returns {{ route: Object, params: Record<string, string> } | null}
 */
export function findMatchingRoute(registry, method, targetPath) {
  const routes = registry.getAll();
  const methodUpper = method.toUpperCase();
  const normalizedTarget = (targetPath.startsWith('/') ? targetPath : '/' + targetPath).split('?')[0];

  for (const route of routes) {
    if (route.method.toUpperCase() !== methodUpper && route.method !== 'ALL') {
      continue;
    }

    const { regex, paramNames } = pathToRegExp(route.path);
    const match = normalizedTarget.match(regex);

    if (match) {
      const params = {};
      paramNames.forEach((name, idx) => {
        params[name] = decodeURIComponent(match[idx + 1]);
      });
      return { route, params };
    }
  }

  return null;
}

/**
 * Generates the mock response for a route definition.
 * 
 * @param {Object} routeDefinition 
 * @param {number} [requestedStatus=200]
 * @returns {{ status: number, body: any, headers?: Record<string, string> }}
 */
export function generateRouteMock(routeDefinition, requestedStatus = 200) {
  const responses = routeDefinition.responses || {};

  // Find target response definition: match requested status, or 200, or 201, or default
  const statusKey = String(requestedStatus);
  const targetResp = responses[statusKey] || responses['200'] || responses['201'] || responses['default'];
  const finalStatus = responses[statusKey] ? requestedStatus : (responses['201'] ? 201 : 200);

  if (!targetResp) {
    return {
      status: finalStatus,
      body: {
        message: 'No response schema or example declared for this route.'
      }
    };
  }

  const media = targetResp.content?.['application/json'];

  // Check explicit example first
  if (media?.example !== undefined) {
    return { status: finalStatus, body: media.example };
  }
  if (targetResp.example !== undefined) {
    return { status: finalStatus, body: targetResp.example };
  }

  // Generate from schema
  const schema = media?.schema || targetResp.schema || targetResp.body;
  if (schema) {
    return { status: finalStatus, body: generateMockFromSchema(schema) };
  }

  return {
    status: finalStatus,
    body: {
      message: targetResp.description || 'Mock Response'
    }
  };
}

/**
 * Determines whether the mock engine is enabled based on options and environment.
 * 
 * @param {Object} options 
 * @returns {boolean}
 */
export function isMockEnabled(options = {}) {
  if (options.mock?.enabled === true) return true;
  if (options.mock?.enabled === false) return false;
  return process.env.NODE_ENV !== 'production';
}

/**
 * Creates Express middleware for handling mock requests.
 * 
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} options 
 * @returns {import('express').RequestHandler}
 */
export function createMockMiddleware(registry, options = {}) {
  const mockPrefix = options.mock?.prefix || '/docs/mock';

  return function scoutMockMiddleware(req, res, next) {
    const reqPath = (req.path || (req.url ? req.url.split('?')[0] : '')) || '/';
    const isMockRoute = reqPath.startsWith(mockPrefix);
    const hasMockHeader = req.headers && (req.headers['x-scout-mock'] === 'true' || req.headers['x-scout-mock'] === '1');
    const hasMockQuery = req.query && (req.query.__mock === 'true' || req.query.__mock === '1');

    if (!isMockRoute && !hasMockHeader && !hasMockQuery) {
      return next();
    }

    const startTime = performance.now();

    // Determine target path to match
    let targetPath = reqPath;
    if (isMockRoute) {
      targetPath = reqPath.slice(mockPrefix.length);
      if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
      }
    }

    const match = findMatchingRoute(registry, req.method, targetPath);

    if (!match) {
      return res.status(404).json({
        error: 'Not Found',
        message: `No registered route matching mock path: ${req.method} ${targetPath}`,
        statusCode: 404
      });
    }

    const mockResponse = generateRouteMock(match.route, 200);
    const latency = Math.round(performance.now() - startTime);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Scout-Mock', 'true');
    res.setHeader('X-Scout-Latency', `${latency}ms`);
    return res.status(mockResponse.status).json(mockResponse.body);
  };
}

/**
 * Mounts the mock engine onto an Express application.
 * 
 * @param {import('express').Application} app 
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} options 
 */
export function mountMockEngine(app, registry, options = {}) {
  const middleware = createMockMiddleware(registry, options);
  app.use(middleware);
}
