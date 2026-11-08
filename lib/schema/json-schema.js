/**
 * Pure JavaScript Schema converter.
 * Converts Zod schemas or raw JavaScript definitions into OpenAPI 3.1 / JSON Schema objects.
 */

/**
 * Checks if a schema is a Zod schema.
 * @param {any} schema 
 * @returns {boolean}
 */
export function isZodSchema(schema) {
  return Boolean(schema && typeof schema === 'object' && ('_def' in schema || typeof schema.safeParse === 'function'));
}

/**
 * Normalizes type identifier across different Zod versions.
 * @param {any} def 
 * @returns {string}
 */
function getZodKind(def) {
  if (!def) return 'unknown';
  const raw = def.type || def.typeName || '';
  return String(raw).replace(/^Zod/, '').toLowerCase();
}

/**
 * Normalizes check metadata across Zod v3 and v4/canary.
 * @param {any} check 
 * @returns {Object}
 */
function normalizeCheck(check) {
  const def = check._zod?.def || check.def || check;
  const kind = def.check || def.kind || '';
  const value = def.minimum ?? def.maximum ?? def.value;
  const format = def.format;
  const inclusive = def.inclusive !== false;
  return { kind, value, format, inclusive, regex: def.pattern || def.regex };
}

/**
 * Converts a Zod type definition to an OpenAPI 3.1 JSON Schema.
 * Pure JS implementation with zero runtime dependencies.
 * 
 * @param {any} zodSchema 
 * @returns {Object} JSON Schema object
 */
export function zodToJsonSchema(zodSchema) {
  if (!zodSchema || !zodSchema._def) {
    return { type: 'object' };
  }

  const def = zodSchema._def;
  const kind = getZodKind(def);

  switch (kind) {
    case 'string': {
      const schema = { type: 'string' };
      const checks = def.checks || [];
      for (const rawCheck of checks) {
        const c = normalizeCheck(rawCheck);
        if (c.kind === 'min' || c.kind === 'min_length') schema.minLength = c.value;
        if (c.kind === 'max' || c.kind === 'max_length') schema.maxLength = c.value;
        if (c.kind === 'email' || c.format === 'email') schema.format = 'email';
        if (c.kind === 'url' || c.format === 'uri') schema.format = 'uri';
        if (c.kind === 'uuid' || c.format === 'uuid') schema.format = 'uuid';
        if ((c.kind === 'regex' || c.kind === 'string_format') && c.regex) {
          schema.pattern = c.regex.source || String(c.regex);
        }
      }
      return schema;
    }

    case 'number': {
      const schema = { type: 'number' };
      const checks = def.checks || [];
      for (const rawCheck of checks) {
        const c = normalizeCheck(rawCheck);
        if (c.kind === 'min' || c.kind === 'greater_than') {
          schema.minimum = c.value;
        }
        if (c.kind === 'max' || c.kind === 'less_than') {
          schema.maximum = c.value;
        }
        if (c.kind === 'int' || c.format === 'int' || c.format === 'safeint') {
          schema.type = 'integer';
        }
      }
      return schema;
    }

    case 'boolean':
      return { type: 'boolean' };

    case 'array': {
      const itemSchema = def.element || def.type;
      return {
        type: 'array',
        items: zodToJsonSchema(itemSchema)
      };
    }

    case 'object': {
      let shape = {};
      if (typeof def.shape === 'function') {
        shape = def.shape();
      } else if (def.shape) {
        shape = def.shape;
      } else if (typeof zodSchema.shape === 'object') {
        shape = zodSchema.shape;
      }

      const properties = {};
      const required = [];

      for (const [key, val] of Object.entries(shape || {})) {
        properties[key] = zodToJsonSchema(val);
        const fieldKind = getZodKind(val?._def);
        if (fieldKind !== 'optional' && fieldKind !== 'default') {
          required.push(key);
        }
      }

      const schema = { type: 'object', properties };
      if (required.length > 0) {
        schema.required = required;
      }
      return schema;
    }

    case 'optional': {
      return zodToJsonSchema(def.innerType);
    }

    case 'nullable': {
      const inner = zodToJsonSchema(def.innerType);
      return { ...inner, nullable: true };
    }

    case 'enum': {
      let enumValues = [];
      if (Array.isArray(def.values)) {
        enumValues = def.values;
      } else if (def.entries) {
        enumValues = Object.values(def.entries);
      }
      return {
        type: 'string',
        enum: enumValues
      };
    }

    case 'union': {
      return {
        oneOf: (def.options || []).map(zodToJsonSchema)
      };
    }

    default:
      return { type: 'object' };
  }
}

/**
 * Normalizes any schema input (Zod, JSON Schema, or plain object) to an OpenAPI schema.
 * 
 * @param {any} input 
 * @returns {Object}
 */
export function normalizeSchema(input) {
  if (!input) return undefined;
  if (isZodSchema(input)) {
    return zodToJsonSchema(input);
  }
  if (typeof input === 'object') {
    return input;
  }
  return { type: 'string' };
}
