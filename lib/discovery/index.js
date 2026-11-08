/**
 * Main Discovery Engine orchestrator.
 */

import { introspectExpress4 } from './express4-adapter.js';
import { introspectExpress5 } from './express5-adapter.js';
import { instrumentRouter } from './interceptor.js';

/**
 * Discovers and registers routes from an Express app.
 * 
 * @param {Object} app - Express application
 * @param {import('../metadata/registry.js').RouteRegistry} registry - Route metadata registry
 * @param {Object} [options={}] - Discovery options
 * @returns {void}
 */
export function discoverRoutes(app, registry, options = {}) {
  if (!app) return;

  const includeFilters = options.include || [];
  const excludeFilters = options.exclude || [];

  /**
   * Helper to determine if a path matches an inclusion/exclusion pattern.
   * Supports prefix strings or regexes.
   */
  function isExcluded(path) {
    if (excludeFilters.length > 0) {
      for (const pattern of excludeFilters) {
        if (pattern instanceof RegExp && pattern.test(path)) return true;
        if (typeof pattern === 'string' && (path.startsWith(pattern) || path === pattern)) return true;
      }
    }
    if (includeFilters.length > 0) {
      let matched = false;
      for (const pattern of includeFilters) {
        if (pattern instanceof RegExp && pattern.test(path)) { matched = true; break; }
        if (typeof pattern === 'string' && (path.startsWith(pattern) || path === pattern)) { matched = true; break; }
      }
      if (!matched) return true;
    }
    return false;
  }

  // Ensure router is initialized if Express provides lazyrouter
  if (typeof app.lazyrouter === 'function' && !app._router) {
    app.lazyrouter();
  }

  // 1. Run stack introspection to discover pre-registered routes
  let discovered = introspectExpress4(app);
  if (discovered.length === 0) {
    discovered = introspectExpress5(app);
  }

  for (const route of discovered) {
    if (isExcluded(route.path) || isExcluded(route.originalPath)) {
      registry.register({ ...route, status: 'excluded' });
    } else {
      registry.register(route);
    }
  }

  // 2. Instrument app for dynamic / subsequent route registrations
  instrumentRouter(app, {
    register: (route) => {
      if (isExcluded(route.path) || isExcluded(route.originalPath)) {
        return registry.register({ ...route, status: 'excluded' });
      }
      return registry.register(route);
    }
  });
}
