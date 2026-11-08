/**
 * Structural OpenAPI 3.1 Validator.
 */

const VALID_HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']);

/**
 * Validates an OpenAPI 3.1 document structure.
 * 
 * @param {Object} doc - Generated OpenAPI document
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateOpenApiDocument(doc) {
  const errors = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document must be an object.'] };
  }

  if (!doc.openapi || !doc.openapi.startsWith('3.1')) {
    errors.push(`Invalid or missing "openapi" version. Expected "3.1.x", got "${doc.openapi}".`);
  }

  if (!doc.info || typeof doc.info !== 'object') {
    errors.push('Missing required "info" object.');
  } else {
    if (!doc.info.title) errors.push('Missing required "info.title".');
    if (!doc.info.version) errors.push('Missing required "info.version".');
  }

  if (!doc.paths || typeof doc.paths !== 'object') {
    errors.push('Missing required "paths" object.');
    return { valid: errors.length === 0, errors };
  }

  for (const [pathKey, pathItem] of Object.entries(doc.paths)) {
    if (!pathKey.startsWith('/')) {
      errors.push(`Path "${pathKey}" must start with a slash '/'.`);
    }

    // Extract path parameters from template e.g. /users/{id} -> ["id"]
    const templateParams = (pathKey.match(/{([^}]+)}/g) || []).map(p => p.slice(1, -1));

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!VALID_HTTP_METHODS.has(method.toLowerCase())) {
        errors.push(`Invalid HTTP method "${method}" at path "${pathKey}".`);
        continue;
      }

      if (!operation.responses || typeof operation.responses !== 'object' || Object.keys(operation.responses).length === 0) {
        errors.push(`Operation "${method.toUpperCase()} ${pathKey}" must define at least one response.`);
      }

      // Verify that all template parameters are defined with required: true and in: "path"
      if (templateParams.length > 0) {
        const declaredParams = operation.parameters || [];
        for (const tp of templateParams) {
          const match = declaredParams.find(p => p.name === tp && p.in === 'path');
          if (!match) {
            errors.push(`Path parameter "{${tp}}" in path "${pathKey}" is not declared in parameters.`);
          } else if (match.required !== true) {
            errors.push(`Path parameter "{${tp}}" in path "${pathKey}" must have required: true.`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

