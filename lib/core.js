/**
 * Core engine orchestrator for SCOUT-JS.
 */

import { RouteRegistry } from './metadata/registry.js';
import { discoverRoutes } from './discovery/index.js';
import { registerDocsRoutes } from './server/routes.js';
import { describeRoute } from './schema/describe-route.js';

/**
 * Initializes SCOUT-JS on an Express application.
 * 
 * @param {import('express').Application} app - Express application
 * @param {Object} [options={}] - Configuration options
 * @param {Object} options.info - API metadata { title, version, description }
 * @param {Object} [options.docs] - Docs UI options { enabled, path, theme }
 * @param {Object} [options.openapi] - OpenAPI options { path, version }
 * @param {Object} [options.discovery] - Route discovery filters { enabled, include, exclude }
 * @param {Object} [options.security] - Security controls { protectDocs, credentials, schemes }
 * @param {Object} [options.server] - Server URL { url, description }
 * @returns {AutoDocsInstance}
 */
export function autoDocs(app, options = {}) {
  if (!app) {
    throw new Error('SCOUT-JS: You must pass an Express application instance to autoDocs(app, options).');
  }

  const registry = new RouteRegistry();

  // 1. Initial route discovery
  if (options.discovery?.enabled !== false) {
    discoverRoutes(app, registry, options.discovery || {});
  }

  // 2. Register documentation routes (/docs, /openapi.json, etc.)
  const serverController = registerDocsRoutes(app, registry, options);

  // 3. Return AutoDocsInstance
  return {
    getDocument: () => serverController.getDocument(),
    refresh: async () => {
      if (options.discovery?.enabled !== false) {
        discoverRoutes(app, registry, options.discovery || {});
      }
      await serverController.refresh();
    },
    getRoutes: () => registry.getAll(),
    getStats: () => registry.getStats(),
    close: () => {
      serverController.close();
      registry.clear();
    }
  };
}

export { describeRoute };

