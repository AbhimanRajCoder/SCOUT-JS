/**
 * Pure JavaScript Response Serializer and Output Filter for SCOUT-JS.
 * Emulates FastAPI's response_model in Express.js.
 * Automatically filters unlisted fields (e.g. password_hash) and validates response schema.
 */

/**
 * Filters a data object or array against a JSON Schema, stripping unlisted properties.
 * 
 * @param {Object} schema 
 * @param {any} data 
 * @param {Array<string>} [issues]
 * @param {string} [currentPath='']
 * @returns {any}
 */
function filterByJsonSchema(schema, data, issues = [], currentPath = '') {
  if (data === null || data === undefined) {
    return data;
  }

  // Array handling
  if (Array.isArray(data)) {
    const itemSchema = schema.items || (schema.type === 'array' ? null : schema);
    if (!itemSchema) return data;
    return data.map((item, idx) => filterByJsonSchema(itemSchema, item, issues, `${currentPath}[${idx}]`));
  }

  if (typeof data !== 'object') {
    return data;
  }

  // Object handling
  const properties = schema.properties || {};
  const required = schema.required || [];
  const propertyKeys = Object.keys(properties);

  // If no properties defined, return data as is
  if (propertyKeys.length === 0) {
    return data;
  }

  const filtered = {};

  for (const key of propertyKeys) {
    if (key in data) {
      filtered[key] = filterByJsonSchema(properties[key], data[key], issues, currentPath ? `${currentPath}.${key}` : key);
    } else if (required.includes(key)) {
      issues.push(`Missing required response field: "${currentPath ? `${currentPath}.${key}` : key}"`);
    }
  }

  return filtered;
}

/**
 * Serializes and filters an outgoing response payload against a schema.
 * 
 * @param {any} schema - Zod schema or JSON Schema definition
 * @param {any} data - Raw payload passed to res.json()
 * @param {Object} [options={}]
 * @param {number} [options.statusCode=200]
 * @param {string} [options.method='GET']
 * @param {string} [options.path='/']
 * @param {Function} [options.onResponseValidationError]
 * @returns {any} Serialized and filtered payload
 */
export function serializeAndFilterResponse(schema, data, options = {}) {
  if (!schema || data === null || data === undefined) {
    return data;
  }

  const rawSchema = schema.schema || schema;

  // 1. Zod Schema
  if (typeof rawSchema.safeParse === 'function') {
    const result = rawSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }

    // Validation warning in non-production
    const issues = (result.error.issues || result.error.errors || []).map(err => ({
      field: (err.path && err.path.length > 0) ? err.path.join('.') : 'root',
      message: err.message,
      code: err.code
    }));

    if (typeof options.onResponseValidationError === 'function') {
      options.onResponseValidationError(issues, data, options);
    } else if (process.env.NODE_ENV !== 'production') {
      const summary = issues.map(i => `${i.field}: ${i.message}`).join(', ');
      console.warn(`[SCOUT-JS] Response schema validation warning on ${options.method || ''} ${options.path || ''}: ${summary}`);
    }

    // Gracefully attempt to strip unknown keys using shape if available
    const shape = rawSchema._def?.shape?.() || rawSchema._def?.shape || rawSchema.shape;
    if (shape && typeof data === 'object' && !Array.isArray(data)) {
      const filtered = {};
      for (const k of Object.keys(shape)) {
        if (k in data) filtered[k] = data[k];
      }
      return filtered;
    }

    return data;
  }

  // 2. Standard JSON Schema
  if (typeof rawSchema === 'object') {
    const issues = [];
    const filtered = filterByJsonSchema(rawSchema, data, issues);

    if (issues.length > 0) {
      if (typeof options.onResponseValidationError === 'function') {
        options.onResponseValidationError(issues.map(msg => ({ message: msg })), data, options);
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SCOUT-JS] Response schema validation warning on ${options.method || ''} ${options.path || ''}: ${issues.join(', ')}`);
      }
    }

    return filtered;
  }

  return data;
}

/**
 * Attaches the response serialization interceptor to the Express res object.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Object} metadata 
 */
export function setupResponseSerialization(req, res, metadata) {
  if (res.__scout_serialization_attached__) {
    return;
  }
  res.__scout_serialization_attached__ = true;

  const originalJson = res.json.bind(res);

  res.json = function scoutSerializedJson(body) {
    if (res.__scout_serialized__) {
      return originalJson(body);
    }
    res.__scout_serialized__ = true;

    try {
      const statusCode = res.statusCode || 200;
      if (statusCode >= 200 && statusCode < 300) {
        let targetSchema = metadata.responseModel;

        if (!targetSchema && metadata.responses) {
          const resp = metadata.responses[statusCode] || metadata.responses[String(statusCode)] || metadata.responses['200'] || metadata.responses['201'];
          targetSchema = resp?.body || resp?.schema || resp?.content?.['application/json']?.schema;
        }

        if (targetSchema) {
          const filtered = serializeAndFilterResponse(targetSchema, body, {
            statusCode,
            method: req.method,
            path: req.originalUrl || req.path,
            onResponseValidationError: metadata.onResponseValidationError
          });
          return originalJson(filtered);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SCOUT-JS] Error during response serialization on ${req.method} ${req.path}:`, err.message);
      }
    }

    return originalJson(body);
  };
}
