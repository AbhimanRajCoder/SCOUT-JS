/**
 * Express 5 Router Stack Introspection Adapter.
 */

import { normalizeExpressPath, joinPaths } from './params.js';
import { extractPrefixFromRegexp, routerMountMap } from './router-tree.js';

/**
 * Traverses an Express 5 router stack to discover pre-registered routes.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {string} [currentPrefix=''] - Current mount prefix
 * @param {Set} [visited] - Set of visited routers
 * @returns {Array<Object>} List of discovered raw route definitions
 */
export function introspectExpress5(appOrRouter, currentPrefix = '', visited = new Set()) {
  const routes = [];
  if (!appOrRouter) return routes;

  if (visited.has(appOrRouter)) {
    return routes;
  }
  visited.add(appOrRouter);

  let routerInstance = null;
  if (appOrRouter._router) {
    routerInstance = appOrRouter._router;
  } else if (Array.isArray(appOrRouter.stack)) {
    routerInstance = appOrRouter;
  } else {
    try {
      if (appOrRouter.router && Array.isArray(appOrRouter.router.stack)) {
        routerInstance = appOrRouter.router;
      }
    } catch {
      // Ignore deprecation getters from Express 4
    }
  }

  const stack = routerInstance?.stack;
  if (!Array.isArray(stack)) {
    return routes;
  }

  for (const layer of stack) {
    if (!layer) continue;

    // Direct route
    if (layer.route) {
      const route = layer.route;
      const rawPath = route.path;
      const methods = Object.keys(route.methods || {}).filter(m => route.methods[m]);
      const paths = Array.isArray(rawPath) ? rawPath : [rawPath];

      let enrichedMetadata = {};
      let handlerName;
      if (Array.isArray(route.stack)) {
        for (const stackLayer of route.stack) {
          if (stackLayer.handle?.__scout_metadata__) {
            enrichedMetadata = { ...enrichedMetadata, ...stackLayer.handle.__scout_metadata__ };
          }
          if (stackLayer.name && stackLayer.name !== '<anonymous>' && stackLayer.name !== 'scoutDescribeRoute') {
            handlerName = stackLayer.name;
          }
        }
      }

      for (const p of paths) {
        const fullRawPath = joinPaths(currentPrefix, p);
        const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);

        for (const method of methods) {
          routes.push({
            method: method.toLowerCase(),
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
    }
    // Sub-router layer
    else if (layer.name === 'router' || (layer.handle && (Array.isArray(layer.handle.stack) || layer.handle.router))) {
      let subRouter = layer.handle;
      try {
        if (layer.handle && layer.handle.router) {
          subRouter = layer.handle.router;
        }
      } catch {
        // ignore
      }

      let mountPrefix = '';
      const recordedMounts = routerMountMap.get(subRouter);
      if (recordedMounts && recordedMounts.length > 0) {
        mountPrefix = recordedMounts[0].prefix;
      } else {
        mountPrefix = extractPrefixFromRegexp(layer.regexp) || '';
      }

      const nextPrefix = joinPaths(currentPrefix, mountPrefix);
      const subRoutes = introspectExpress5(subRouter, nextPrefix, visited);
      routes.push(...subRoutes);
    }
  }

  return routes;
}
