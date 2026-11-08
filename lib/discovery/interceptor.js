/**
 * Runtime route instrumentation for Express applications and routers.
 * Intercepts route additions happening after autoDocs() initialization.
 */

import { normalizeExpressPath, joinPaths } from './params.js';
import { recordRouterMount, routerMountMap } from './router-tree.js';
import { introspectExpress4 } from './express4-adapter.js';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'all'];

/**
 * Helper to extract metadata from handlers passed to an Express route.
 * @param {Array<Function>} handlers 
 * @returns {{ enrichedMetadata: Object, handlerName: string|undefined }}
 */
function extractHandlerMetadata(handlers) {
  let enrichedMetadata = {};
  let handlerName;

  for (const h of handlers) {
    if (!h) continue;
    if (h.__scout_metadata__) {
      enrichedMetadata = { ...enrichedMetadata, ...h.__scout_metadata__ };
    }
    if (typeof h === 'function' && h.name && h.name !== '<anonymous>' && h.name !== 'scoutDescribeRoute') {
      handlerName = h.name;
    }
  }

  return { enrichedMetadata, handlerName };
}

/**
 * Instruments an Express app or Router instance to capture route registrations in real time.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {import('../metadata/registry.js').RouteRegistry} registry - Target route registry
 * @param {string} [currentPrefix=''] - Current router prefix
 */
export function instrumentRouter(appOrRouter, registry, currentPrefix = '') {
  if (!appOrRouter || appOrRouter.__scout_instrumented__) {
    return;
  }
  appOrRouter.__scout_instrumented__ = true;

  // 1. Intercept HTTP methods
  for (const method of HTTP_METHODS) {
    const originalMethod = appOrRouter[method];
    if (typeof originalMethod !== 'function') continue;

    appOrRouter[method] = function (path, ...handlers) {
      if (method === 'get' && arguments.length === 1 && typeof path === 'string' && !path.startsWith('/')) {
        return originalMethod.apply(this, arguments);
      }

      if (typeof path === 'string' || path instanceof RegExp) {
        const fullRawPath = joinPaths(currentPrefix, path);
        const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);
        const { enrichedMetadata, handlerName } = extractHandlerMetadata(handlers);

        if (method === 'all') {
          for (const m of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']) {
            registry.register({
              method: m,
              path: openApiPath,
              originalPath: fullRawPath,
              pathParams,
              handlerName,
              status: isSupported ? 'discovered' : 'unsupported',
              warnings: [...warnings],
              ...enrichedMetadata
            });
          }
        } else {
          registry.register({
            method,
            path: openApiPath,
            originalPath: fullRawPath,
            pathParams,
            handlerName,
            status: isSupported ? 'discovered' : 'unsupported',
            warnings: [...warnings],
            ...enrichedMetadata
          });
        }
      }

      return originalMethod.apply(this, arguments);
    };
  }

  // 2. Intercept app.route() chaining
  const originalRoute = appOrRouter.route;
  if (typeof originalRoute === 'function') {
    appOrRouter.route = function (path) {
      const routeInstance = originalRoute.apply(this, arguments);
      if (routeInstance && !routeInstance.__scout_instrumented__) {
        routeInstance.__scout_instrumented__ = true;
        for (const method of HTTP_METHODS) {
          const originalRouteMethod = routeInstance[method];
          if (typeof originalRouteMethod !== 'function') continue;

          routeInstance[method] = function (...handlers) {
            const fullRawPath = joinPaths(currentPrefix, path);
            const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);
            const { enrichedMetadata, handlerName } = extractHandlerMetadata(handlers);

            if (method === 'all') {
              for (const m of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']) {
                registry.register({
                  method: m,
                  path: openApiPath,
                  originalPath: fullRawPath,
                  pathParams,
                  handlerName,
                  status: isSupported ? 'discovered' : 'unsupported',
                  warnings: [...warnings],
                  ...enrichedMetadata
                });
              }
            } else {
              registry.register({
                method,
                path: openApiPath,
                originalPath: fullRawPath,
                pathParams,
                handlerName,
                status: isSupported ? 'discovered' : 'unsupported',
                warnings: [...warnings],
                ...enrichedMetadata
              });
            }

            return originalRouteMethod.apply(this, arguments);
          };
        }
      }
      return routeInstance;
    };
  }

  // 3. Intercept app.use() for sub-routers
  const originalUse = appOrRouter.use;
  if (typeof originalUse === 'function') {
    appOrRouter.use = function (...args) {
      let mountPrefix = '';
      let subRouters = [];

      if (typeof args[0] === 'string') {
        mountPrefix = args[0];
        subRouters = args.slice(1);
      } else {
        subRouters = args;
      }

      for (const item of subRouters) {
        if (item && (typeof item === 'function' || typeof item === 'object')) {
          if (Array.isArray(item.stack) || item.route || typeof item.use === 'function') {
            const combinedPrefix = joinPaths(currentPrefix, mountPrefix);
            recordRouterMount(item, combinedPrefix, appOrRouter);

            // Introspect any existing routes already on this router
            const existingSubRoutes = introspectExpress4(item, combinedPrefix);
            for (const r of existingSubRoutes) {
              registry.register(r);
            }

            // Instrument for any future routes
            instrumentRouter(item, registry, combinedPrefix);
          }
        }
      }

      return originalUse.apply(this, args);
    };
  }
}
