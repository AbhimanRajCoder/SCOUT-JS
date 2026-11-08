/**
 * Express 4 Router Stack Introspection Adapter.
 */

import { normalizeExpressPath, joinPaths } from './params.js';
import { extractPrefixFromRegexp, routerMountMap } from './router-tree.js';
import { extractJSDocFromHandlers } from './jsdoc-parser.js';

/**
 * Traverses an Express 4 router stack to discover pre-registered routes.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {string} [currentPrefix=''] - Current mount prefix
 * @param {Set} [visited] - Set of visited routers to prevent cycles
 * @returns {Array<Object>} List of discovered raw route definitions
 */
export function introspectExpress4(appOrRouter, currentPrefix = '', visited = new Set()) {
  const routes = [];
  if (!appOrRouter) return routes;

  if (visited.has(appOrRouter)) {
    return routes;
  }
  visited.add(appOrRouter);

  const stack = appOrRouter._router?.stack || appOrRouter.stack;
  if (!Array.isArray(stack)) {
    return routes;
  }

  for (const layer of stack) {
    if (!layer) continue;

    // Direct route layer
    if (layer.route) {
      const route = layer.route;
      const rawPath = route.path;
      const methods = Object.keys(route.methods || {}).filter(m => route.methods[m]);
      const paths = Array.isArray(rawPath) ? rawPath : [rawPath];

      // Extract metadata attached by describeRoute()
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

        // Phase 5: Extract JSDoc docstrings
        const handlers = route.stack.map(l => l.handle).filter(Boolean);
        const jsdoc = extractJSDocFromHandlers(handlers);
        if (jsdoc) {
          if (!enrichedMetadata.summary && jsdoc.summary) enrichedMetadata.summary = jsdoc.summary;
          if (!enrichedMetadata.description && jsdoc.description) enrichedMetadata.description = jsdoc.description;
          if ((!enrichedMetadata.tags || enrichedMetadata.tags.length === 0) && jsdoc.tags && jsdoc.tags.length > 0) enrichedMetadata.tags = jsdoc.tags;
          if (enrichedMetadata.deprecated === undefined && jsdoc.deprecated) enrichedMetadata.deprecated = true;
          if (jsdoc.params && Object.keys(jsdoc.params).length > 0) enrichedMetadata.jsdocParams = jsdoc.params;
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
    else if (layer.name === 'router' || (layer.handle && Array.isArray(layer.handle.stack))) {
      const subRouter = layer.handle;
      
      let mountPrefix = '';
      const recordedMounts = routerMountMap.get(subRouter);
      if (recordedMounts && recordedMounts.length > 0) {
        mountPrefix = recordedMounts[0].prefix;
      } else {
        mountPrefix = extractPrefixFromRegexp(layer.regexp) || '';
      }

      const nextPrefix = joinPaths(currentPrefix, mountPrefix);
      const subRoutes = introspectExpress4(subRouter, nextPrefix, visited);
      routes.push(...subRoutes);
    }
  }

  return routes;
}
