/**
 * Route enrichment helper: describeRoute()
 */

import { normalizeSchema } from './json-schema.js';

/**
 * Creates route description metadata to enrich OpenAPI documentation.
 * 
 * @param {Object} options
 * @param {string} [options.summary]
 * @param {string} [options.description]
 * @param {string[]} [options.tags]
 * @param {any} [options.body] - Request body schema (Zod or JSON Schema or { schema, example })
 * @param {any} [options.example] - Example request body payload
 * @param {any} [options.query] - Query parameter schema (Zod or JSON Schema)
 * @param {any} [options.headers] - Headers parameter schema (Zod or JSON Schema)
 * @param {Record<string|number, any>} [options.responses] - Response schemas
 * @param {any[]} [options.security] - Security requirements
 * @returns {import('express').RequestHandler}
 */
export function describeRoute(options = {}) {
  const normalizedMetadata = {
    summary: options.summary,
    description: options.description,
    tags: options.tags,
    security: options.security
  };

  // Process request body
  if (options.body) {
    const rawSchema = options.body?.schema || options.body;
    const bodySchema = normalizeSchema(rawSchema);
    const bodyExample = options.body?.example ?? options.example;

    const mediaObj = {
      schema: bodySchema
    };

    if (bodyExample !== undefined) {
      mediaObj.example = bodyExample;
    }

    normalizedMetadata.requestBody = {
      required: true,
      content: {
        'application/json': mediaObj
      }
    };
  }

  // Process query parameters
  if (options.query) {
    const querySchema = normalizeSchema(options.query);
    const queryParams = [];
    if (querySchema.type === 'object' && querySchema.properties) {
      for (const [key, prop] of Object.entries(querySchema.properties)) {
        queryParams.push({
          name: key,
          in: 'query',
          required: querySchema.required?.includes(key) || false,
          description: prop.description,
          schema: prop
        });
      }
    }
    normalizedMetadata.queryParams = queryParams;
  }

  // Process header parameters
  if (options.headers) {
    const headerSchema = normalizeSchema(options.headers);
    const headerParams = [];
    if (headerSchema.type === 'object' && headerSchema.properties) {
      for (const [key, prop] of Object.entries(headerSchema.properties)) {
        headerParams.push({
          name: key,
          in: 'header',
          required: headerSchema.required?.includes(key) || false,
          description: prop.description,
          schema: prop
        });
      }
    }
    normalizedMetadata.headerParams = headerParams;
  }

  // Process responses
  if (options.responses) {
    const responses = {};
    for (const [status, resp] of Object.entries(options.responses)) {
      if (typeof resp === 'string') {
        responses[status] = { description: resp };
      } else if (resp && typeof resp === 'object') {
        const description = resp.description || 'Response';
        const body = resp.body || resp.schema;
        const example = resp.example;
        if (body) {
          const mediaObj = {
            schema: normalizeSchema(body)
          };
          if (example !== undefined) {
            mediaObj.example = example;
          }
          responses[status] = {
            description,
            content: {
              'application/json': mediaObj
            }
          };
        } else {
          responses[status] = { description };
        }
      }
    }
    normalizedMetadata.responses = responses;
  }

  // Transparent Express middleware
  const middleware = function scoutDescribeRoute(req, res, next) {
    return next();
  };

  middleware.__scout_metadata__ = normalizedMetadata;
  return middleware;
}
