/**
 * In-memory Route Metadata Registry for SCOUT-JS.
 * Tracks discovered routes, enrichment metadata, and status.
 */

export class RouteRegistry {
  constructor() {
    /** @type {Map<string, import('./registry.js').RouteDefinition>} */
    this.routes = new Map();
  }

  /**
   * Generates a unique route key.
   * @param {string} method 
   * @param {string} path 
   * @returns {string}
   */
  makeKey(method, path) {
    return `${(method || '').toLowerCase()}:${path}`;
  }

  /**
   * Registers or updates a route definition.
   * If a route is already registered, preserves existing metadata and merges updates.
   * 
   * @param {Object} definition
   * @returns {Object} the stored RouteDefinition
   */
  register(definition) {
    const key = this.makeKey(definition.method, definition.path);
    const existing = this.routes.get(key);

    if (existing) {
      // Merge properties without overriding with undefined
      const merged = {
        ...existing,
        ...definition,
        warnings: Array.from(new Set([...(existing.warnings || []), ...(definition.warnings || [])])),
        pathParams: definition.pathParams?.length ? definition.pathParams : existing.pathParams,
        tags: definition.tags?.length ? definition.tags : existing.tags,
        responses: { ...(existing.responses || {}), ...(definition.responses || {}) },
        // Don't downgrade status from partial to discovered if issues were detected
        status: (existing.status === 'unsupported' || definition.status === 'unsupported') 
          ? 'unsupported' 
          : (existing.status === 'partial' || definition.status === 'partial') 
            ? 'partial' 
            : definition.status || existing.status || 'discovered'
      };

      this.routes.set(key, merged);
      return merged;
    }

    const routeDef = {
      id: key,
      method: (definition.method || 'get').toLowerCase(),
      path: definition.path,
      originalPath: definition.originalPath || definition.path,
      pathParams: definition.pathParams || [],
      status: definition.status || 'discovered',
      handlerName: definition.handlerName || 'anonymous',
      tags: definition.tags || [],
      summary: definition.summary || '',
      description: definition.description || '',
      requestBody: definition.requestBody || undefined,
      responses: definition.responses || undefined,
      security: definition.security || undefined,
      warnings: definition.warnings || []
    };

    this.routes.set(key, routeDef);
    return routeDef;
  }

  /**
   * Finds a route definition by method and path.
   * @param {string} method 
   * @param {string} path 
   * @returns {Object|undefined}
   */
  get(method, path) {
    return this.routes.get(this.makeKey(method, path));
  }

  /**
   * Returns all registered routes as an array.
   * @returns {Array<Object>}
   */
  getAll() {
    return Array.from(this.routes.values());
  }

  /**
   * Returns statistics about discovered routes.
   * @returns {{ total: number, discovered: number, partial: number, unsupported: number, excluded: number }}
   */
  getStats() {
    const stats = {
      total: this.routes.size,
      discovered: 0,
      partial: 0,
      unsupported: 0,
      excluded: 0
    };

    for (const route of this.routes.values()) {
      if (stats[route.status] !== undefined) {
        stats[route.status]++;
      }
    }

    return stats;
  }

  /**
   * Clears the registry.
   */
  clear() {
    this.routes.clear();
  }
}

