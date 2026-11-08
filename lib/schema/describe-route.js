/**
 * Route enrichment and runtime validation helper: describeRoute()
 */

import { normalizeSchema } from './json-schema.js';
import { validatePayload } from './runtime-validator.js';

/**
 * Creates route description metadata to enrich OpenAPI documentation
 * and optionally validates incoming requests at runtime.
 * 
 * @param {Object} options
 * @param {string} [options.summary]
 * @param {string} [options.description]
 * @param {string[]} [options.tags]
 * @param {any} [options.body] - Request body schema (Zod or JSON Schema or { schema, example })
 * @param {any} [options.example] - Example request body payload
 * @param {any} [options.query] - Query parameter schema (Zod or JSON Schema)
 * @param {any} [options.headers] - Headers parameter schema (Zod or JSON Schema)
 * @param {any} [options.params] - Path parameters schema (Zod or JSON Schema)
 * @param {Record<string|number, any>} [options.responses] - Response schemas
 * @param {any[]} [options.security] - Security requirements
 * @param {boolean|{ body?: boolean, query?: boolean, params?: boolean, headers?: boolean }} [options.validate=false] - Whether to validate requests at runtime
 * @param {Function} [options.onValidationError] - Custom error handler callback (issues, req, res, next)
 * @returns {import('express').RequestHandler}
 */
export function describeRoute(options = {}) {
  const normalizedMetadata = {
    summary: options.summary,
    description: options.description,
    tags: options.tags,
    security: options.security
  };

  // Determine validation settings
  const shouldValidate = Boolean(options.validate);
  const validateConfig = typeof options.validate === 'object' && options.validate !== null ? options.validate : {
    body: shouldValidate,
    query: shouldValidate,
    params: shouldValidate,
    headers: shouldValidate
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
  const responses = {};
  if (options.responses) {
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
  }

  // Auto-document 400 Bad Request when validation is enabled
  if (shouldValidate && !responses['400']) {
    responses['400'] = {
      description: 'Bad Request - Validation Error'
    };
  }

  if (Object.keys(responses).length > 0) {
    normalizedMetadata.responses = responses;
  }

  // Express middleware with optional runtime validation
  const middleware = function scoutDescribeRoute(req, res, next) {
    if (!shouldValidate) {
      return next();
    }

    const allIssues = [];

    // 1. Validate Body
    if (validateConfig.body !== false && options.body && req.body !== undefined) {
      const bodyResult = validatePayload(options.body, req.body, 'body');
      if (!bodyResult.valid) {
        allIssues.push(...bodyResult.issues.map(i => ({ ...i, location: 'body' })));
      } else if (bodyResult.data !== undefined) {
        req.body = bodyResult.data;
      }
    }

    // 2. Validate Query Parameters
    if (validateConfig.query !== false && options.query && req.query !== undefined) {
      const queryResult = validatePayload(options.query, req.query, 'query');
      if (!queryResult.valid) {
        allIssues.push(...queryResult.issues.map(i => ({ ...i, location: 'query' })));
      } else if (queryResult.data !== undefined) {
        req.query = queryResult.data;
      }
    }

    // 3. Validate Path Parameters
    if (validateConfig.params !== false && options.params && req.params !== undefined) {
      const paramsResult = validatePayload(options.params, req.params, 'params');
      if (!paramsResult.valid) {
        allIssues.push(...paramsResult.issues.map(i => ({ ...i, location: 'params' })));
      } else if (paramsResult.data !== undefined) {
        req.params = paramsResult.data;
      }
    }

    // 4. Validate Headers
    if (validateConfig.headers !== false && options.headers && req.headers !== undefined) {
      const headersResult = validatePayload(options.headers, req.headers, 'headers');
      if (!headersResult.valid) {
        allIssues.push(...headersResult.issues.map(i => ({ ...i, location: 'headers' })));
      }
    }

    // Return 400 on validation failure
    if (allIssues.length > 0) {
      if (typeof options.onValidationError === 'function') {
        return options.onValidationError(allIssues, req, res, next);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request validation failed',
        statusCode: 400,
        issues: allIssues
      });
    }

    return next();
  };

  middleware.__scout_metadata__ = normalizedMetadata;
  return middleware;
}
