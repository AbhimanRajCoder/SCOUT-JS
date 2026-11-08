/**
 * Documentation routes and endpoint mounting.
 */

import { buildOpenApiDocument } from '../openapi/builder.js';
import { toJson, toYaml } from '../openapi/serializer.js';
import { validateOpenApiDocument } from '../openapi/validator.js';
import { renderDocsHtml } from '../ui/render.js';
import { isDocsEnabled, createAuthGuard } from './security.js';
import { mountMockEngine, isMockEnabled } from './mock-engine.js';

/**
 * Registers documentation and specification endpoints on an Express application.
 * 
 * @param {Object} app - Express application
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} options 
 * @returns {{ getDocument: () => Object, refresh: () => Promise<void>, close: () => void }}
 */
export function registerDocsRoutes(app, registry, options = {}) {
  const docsPath = options.docs?.path || '/docs';
  const openApiPath = options.openapi?.path || '/openapi.json';
  const yamlPath = openApiPath.replace(/\.json$/, '.yaml');
  const healthPath = (docsPath === '/' ? '' : docsPath) + '/health';

  const enabled = isDocsEnabled(options);
  const authGuard = createAuthGuard(options);

  // Cached representations
  let cachedDoc = null;
  let cachedJson = null;
  let cachedYaml = null;
  let cachedHtml = null;

  function generateSpec() {
    cachedDoc = buildOpenApiDocument(registry, options);
    cachedJson = toJson(cachedDoc);
    cachedYaml = toYaml(cachedDoc);
    cachedHtml = renderDocsHtml(cachedDoc, options);
    return cachedDoc;
  }

  // Pre-generate on startup
  generateSpec();

  // Mount Mock Server Engine (Phase 4)
  if (isMockEnabled(options)) {
    mountMockEngine(app, registry, options);
  }

  if (enabled) {
    // 1. Interactive UI: /docs
    app.get(docsPath, authGuard, (req, res) => {
      if (!cachedHtml) generateSpec();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(cachedHtml);
    });

    // 2. OpenAPI Spec JSON: /openapi.json
    app.get(openApiPath, authGuard, (req, res) => {
      if (!cachedJson) generateSpec();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(cachedJson);
    });

    // 3. OpenAPI Spec YAML: /openapi.yaml
    app.get(yamlPath, authGuard, (req, res) => {
      if (!cachedYaml) generateSpec();
      res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
      res.send(cachedYaml);
    });

    // 4. Health and Diagnostics: /docs/health
    app.get(healthPath, authGuard, (req, res) => {
      const stats = registry.getStats();
      const validation = validateOpenApiDocument(cachedDoc || generateSpec());

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: options.info?.version || '1.0.0',
        routes: stats,
        validation: {
          valid: validation.valid,
          errorCount: validation.errors.length,
          errors: validation.errors
        },
        memory: process.memoryUsage()
      });
    });
  }

  return {
    getDocument: () => cachedDoc || generateSpec(),
    refresh: async () => {
      generateSpec();
    },
    close: () => {
      cachedDoc = null;
      cachedJson = null;
      cachedYaml = null;
      cachedHtml = null;
    }
  };
}

