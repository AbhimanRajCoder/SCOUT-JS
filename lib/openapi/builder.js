/**
 * OpenAPI 3.1 Document Builder.
 * Adheres strictly to PRD Principle: Never fabricate schemas or examples.
 */

/**
 * Derives a default tag name from an OpenAPI path.
 * e.g. "/api/v1/users/{id}" -> "Users"
 * 
 * @param {string} path 
 * @returns {string}
 */
export function deriveTag(path) {
  if (!path || path === '/') return 'Default';
  const segments = path.split('/').filter(s => s && !s.startsWith('{') && s !== 'api' && !s.startsWith('v'));
  if (segments.length === 0) return 'Default';
  const tag = segments[0];
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * Generates an operationId deterministically.
 * e.g. ("get", "/users/{id}") -> "getUsersById"
 * 
 * @param {string} method 
 * @param {string} path 
 * @returns {string}
 */
export function deriveOperationId(method, path) {
  const parts = path
    .split('/')
    .filter(Boolean)
    .map(p => {
      if (p.startsWith('{') && p.endsWith('}')) {
        const param = p.slice(1, -1);
        return 'By' + param.charAt(0).toUpperCase() + param.slice(1);
      }
      return p.charAt(0).toUpperCase() + p.slice(1);
    });

  return method.toLowerCase() + parts.join('');
}

/**
 * Builds an OpenAPI 3.1.0 document from registered routes and options.
 * 
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} [options={}]
 * @returns {Object} OpenAPI 3.1.0 document
 */
export function buildOpenApiDocument(registry, options = {}) {
  const info = {
    title: options.info?.title || 'API Documentation',
    version: options.info?.version || '1.0.0',
    description: options.info?.description || 'Auto-generated interactive API documentation powered by SCOUT-JS.'
  };

  const document = {
    openapi: '3.1.0',
    info,
    paths: {},
    components: {
      schemas: options.components?.schemas || {},
      securitySchemes: options.security?.schemes || options.components?.securitySchemes || {}
    }
  };

  if (options.server?.url) {
    document.servers = [
      {
        url: options.server.url,
        description: options.server.description || 'API Server'
      }
    ];
  }

  const routes = registry.getAll();

  for (const route of routes) {
    // Excluded routes are not added to OpenAPI paths
    if (route.status === 'excluded') {
      continue;
    }

    const { path, method, pathParams, summary, description, tags, requestBody, responses, security, queryParams, headerParams } = route;

    if (!document.paths[path]) {
      document.paths[path] = {};
    }

    const operationTags = (tags && tags.length > 0) ? tags : [deriveTag(path)];
    const operationId = deriveOperationId(method, path);

    // Build parameters array (path params + query params)
    const parameters = [];

    // Path parameters - MUST always have required: true
    if (Array.isArray(pathParams)) {
      for (const p of pathParams) {
        parameters.push({
          name: p.name,
          in: 'path',
          required: true,
          description: p.description,
          schema: p.schema || { type: 'string' }
        });
      }
    }

    // Query parameters
    if (Array.isArray(queryParams)) {
      for (const q of queryParams) {
        parameters.push({
          name: q.name,
          in: 'query',
          required: Boolean(q.required),
          description: q.description,
          schema: q.schema || { type: 'string' }
        });
      }
    }

    // Header parameters
    if (Array.isArray(headerParams)) {
      for (const h of headerParams) {
        parameters.push({
          name: h.name,
          in: 'header',
          required: Boolean(h.required),
          description: h.description,
          schema: h.schema || { type: 'string' }
        });
      }
    }

    // Build responses
    // Principle: Never fabricate schemas! If unspecified, provide status description only.
    let operationResponses = responses;
    if (!operationResponses || Object.keys(operationResponses).length === 0) {
      operationResponses = {
        '200': {
          description: 'Successful response'
        }
      };
    }

    const operation = {
      operationId,
      tags: operationTags,
      summary: summary || `${method.toUpperCase()} ${path}`,
      responses: operationResponses
    };

    if (description) {
      operation.description = description;
    }

    if (parameters.length > 0) {
      operation.parameters = parameters;
    }

    if (requestBody) {
      operation.requestBody = requestBody;
    }

    if (security) {
      operation.security = security;
    }

    document.paths[path][method.toLowerCase()] = operation;
  }

  return document;
}

