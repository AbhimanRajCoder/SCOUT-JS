/**
 * SCOUT-JS: Zero-config runtime API documentation engine for Express.js
 */

export { autoDocs, describeRoute } from './lib/core.js';
export { RouteRegistry } from './lib/metadata/registry.js';
export { buildOpenApiDocument } from './lib/openapi/builder.js';
export { validateOpenApiDocument } from './lib/openapi/validator.js';

