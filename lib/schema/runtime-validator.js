/**
 * Pure JavaScript Runtime Request Validator for SCOUT-JS.
 * Validates request body, query parameters, path parameters, and headers.
 * Supports both Zod schemas and standard JSON Schema definitions with zero external dependencies.
 */

/**
 * Validates data against a schema (Zod or JSON Schema).
 * 
 * @param {any} schema - Zod schema or JSON Schema object
 * @param {any} data - Input payload (req.body, req.query, req.params, or req.headers)
 * @param {string} location - 'body' | 'query' | 'params' | 'headers'
 * @returns {{ valid: boolean, data?: any, issues?: Array<{ field: string, message: string, code?: string }> }}
 */
export function validatePayload(schema, data, location = 'body') {
  if (!schema) {
    return { valid: true, data };
  }

  // 1. Zod Schema Validation
  const zodSchema = schema.schema || schema;
  if (typeof zodSchema.safeParse === 'function') {
    const result = zodSchema.safeParse(data);
    if (!result.success) {
      const rawIssues = result.error.issues || result.error.errors || [];
      return {
        valid: false,
        issues: rawIssues.map(err => ({
          field: (err.path && err.path.length > 0) ? err.path.join('.') : location,
          message: err.message,
          code: err.code
        }))
      };
    }
    return { valid: true, data: result.data };
  }

  // 2. Standard JSON Schema Validation
  const jsonSchema = zodSchema;
  if (typeof jsonSchema !== 'object' || jsonSchema === null) {
    return { valid: true, data };
  }

  const issues = [];
  const targetData = data || {};

  // For query & params, convert string numbers/booleans if schema expects them
  const coercedData = (location === 'query' || location === 'params' || location === 'headers') && typeof targetData === 'object'
    ? { ...targetData }
    : targetData;

  if (jsonSchema.type === 'object' && jsonSchema.properties) {
    if (typeof targetData !== 'object' || targetData === null || Array.isArray(targetData)) {
      return {
        valid: false,
        issues: [{ field: location, message: `Expected an object for ${location}` }]
      };
    }

    // Check required fields
    if (Array.isArray(jsonSchema.required)) {
      for (const reqField of jsonSchema.required) {
        if (targetData[reqField] === undefined || targetData[reqField] === null || targetData[reqField] === '') {
          issues.push({
            field: reqField,
            message: `Field '${reqField}' is required in ${location}`
          });
        }
      }
    }

    // Check properties
    for (const [key, propSchema] of Object.entries(jsonSchema.properties)) {
      let val = targetData[key];

      // Type coercion for query & params (e.g. limit="10" -> 10)
      if ((location === 'query' || location === 'params' || location === 'headers') && val !== undefined) {
        if ((propSchema.type === 'number' || propSchema.type === 'integer') && typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) {
          val = Number(val);
          coercedData[key] = val;
        } else if (propSchema.type === 'boolean' && typeof val === 'string') {
          if (val === 'true') { val = true; coercedData[key] = true; }
          else if (val === 'false') { val = false; coercedData[key] = false; }
        }
      }

      if (val === undefined) continue;

      // Type checking
      if (propSchema.type) {
        if (propSchema.type === 'string' && typeof val !== 'string') {
          issues.push({ field: key, message: `Field '${key}' must be a string` });
        } else if ((propSchema.type === 'number' || propSchema.type === 'integer') && (typeof val !== 'number' || isNaN(val))) {
          issues.push({ field: key, message: `Field '${key}' must be a number` });
        } else if (propSchema.type === 'integer' && !Number.isInteger(val)) {
          issues.push({ field: key, message: `Field '${key}' must be an integer` });
        } else if (propSchema.type === 'boolean' && typeof val !== 'boolean') {
          issues.push({ field: key, message: `Field '${key}' must be a boolean` });
        } else if (propSchema.type === 'array' && !Array.isArray(val)) {
          issues.push({ field: key, message: `Field '${key}' must be an array` });
        }
      }

      // String constraints
      if (typeof val === 'string') {
        if (propSchema.minLength !== undefined && val.length < propSchema.minLength) {
          issues.push({ field: key, message: `Field '${key}' must be at least ${propSchema.minLength} characters` });
        }
        if (propSchema.maxLength !== undefined && val.length > propSchema.maxLength) {
          issues.push({ field: key, message: `Field '${key}' must not exceed ${propSchema.maxLength} characters` });
        }
        if (propSchema.pattern) {
          const regex = new RegExp(propSchema.pattern);
          if (!regex.test(val)) {
            issues.push({ field: key, message: `Field '${key}' does not match required pattern` });
          }
        }
        if (propSchema.format === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            issues.push({ field: key, message: `Field '${key}' must be a valid email address` });
          }
        }
      }

      // Number constraints
      if (typeof val === 'number') {
        if (propSchema.minimum !== undefined && val < propSchema.minimum) {
          issues.push({ field: key, message: `Field '${key}' must be >= ${propSchema.minimum}` });
        }
        if (propSchema.maximum !== undefined && val > propSchema.maximum) {
          issues.push({ field: key, message: `Field '${key}' must be <= ${propSchema.maximum}` });
        }
      }

      // Enum constraints
      if (Array.isArray(propSchema.enum)) {
        if (!propSchema.enum.includes(val)) {
          issues.push({ field: key, message: `Field '${key}' must be one of: [${propSchema.enum.join(', ')}]` });
        }
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return { valid: true, data: coercedData };
}
