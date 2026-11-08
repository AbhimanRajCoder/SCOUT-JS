/**
 * Path and parameter normalization utilities for SCOUT-JS.
 */

/**
 * Normalizes an Express path into an OpenAPI 3.1 path.
 * Converts `:param` into `{param}`, removes trailing slashes, ensures leading slash.
 * 
 * @param {string} path - Express path, e.g. "/users/:id/posts/:postId?"
 * @returns {{ openApiPath: string, pathParams: Array<{ name: string, in: string, required: boolean, schema: { type: string } }>, isSupported: boolean, warnings: string[] }}
 */
export function normalizeExpressPath(path) {
  const warnings = [];
  let isSupported = true;

  if (typeof path !== 'string') {
    return {
      openApiPath: String(path || '/'),
      pathParams: [],
      isSupported: false,
      warnings: ['Path is not a string (e.g. RegExp or Array). Marked as unsupported for automatic OpenAPI path conversion.']
    };
  }

  // Ensure path starts with a slash
  let cleanPath = path.trim();
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // Deduplicate redundant slashes, except keeping single '/'
  cleanPath = cleanPath.replace(/\/+/g, '/');
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const pathParams = [];
  const paramNames = new Set();

  // Match :paramName with optional ? or custom regex like :id(\\d+)
  const openApiPath = cleanPath.replace(/:([a-zA-Z0-9_]+)(\([^)]+\))?(\?)?/g, (match, paramName, customRegex, isOptional) => {
    if (paramNames.has(paramName)) {
      warnings.push(`Duplicate path parameter detected: "${paramName}".`);
    }
    paramNames.add(paramName);

    if (customRegex) {
      warnings.push(`Parameter "${paramName}" uses custom RegExp pattern "${customRegex}". Pattern stored in description.`);
    }

    pathParams.push({
      name: paramName,
      in: 'path',
      required: true, // OpenAPI 3.1 requires path parameters to always be required: true
      description: customRegex ? `Pattern: ${customRegex}` : undefined,
      schema: {
        type: 'string'
      }
    });

    return `{${paramName}}`;
  });

  // Check if there are unhandled wildcards or regexes (* or (.*))
  if (openApiPath.includes('*') || openApiPath.includes('(')) {
    isSupported = false;
    warnings.push(`Path contains unsupported wildcard or regex pattern: "${openApiPath}".`);
  }

  return {
    openApiPath,
    pathParams,
    isSupported,
    warnings
  };
}

/**
 * Combines parent mount path and child router path cleanly.
 * 
 * @param {string} parentPath 
 * @param {string} childPath 
 * @returns {string}
 */
export function joinPaths(parentPath, childPath) {
  const p = (parentPath || '').trim();
  const c = (childPath || '').trim();

  if (!p || p === '/') return c.startsWith('/') ? c : '/' + c;
  if (!c || c === '/') return p.startsWith('/') ? p : '/' + p;

  const normalizedP = p.endsWith('/') ? p.slice(0, -1) : p;
  const normalizedC = c.startsWith('/') ? c : '/' + c;

  return (normalizedP + normalizedC).replace(/\/+/g, '/');
}

