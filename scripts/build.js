/**
 * Zero-dependency pure JavaScript build script.
 * Bundles SCOUT-JS into a single CommonJS file (index.cjs) for seamless dual ESM/CJS support.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cssContent = fs.readFileSync(path.join(rootDir, 'lib/ui/assets/style.css'), 'utf-8');
const jsContent = fs.readFileSync(path.join(rootDir, 'lib/ui/assets/playground.js'), 'utf-8');

// List modules in topological dependency order
const modules = [
  'lib/discovery/params.js',
  'lib/discovery/router-tree.js',
  'lib/discovery/express4-adapter.js',
  'lib/discovery/express5-adapter.js',
  'lib/discovery/interceptor.js',
  'lib/discovery/index.js',
  'lib/metadata/registry.js',
  'lib/openapi/serializer.js',
  'lib/openapi/validator.js',
  'lib/openapi/builder.js',
  'lib/schema/json-schema.js',
  'lib/schema/runtime-validator.js',
  'lib/schema/response-serializer.js',
  'lib/server/mock-engine.js',
  'lib/schema/describe-route.js',
  'lib/server/security.js',
  'lib/ui/render.js',
  'lib/server/routes.js',
  'lib/core.js'
];

let bundle = `/**
 * SCOUT-JS - CommonJS Distribution Build
 * Generated automatically. Do not edit manually.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Pre-inlined UI Assets
const cssContent = ${JSON.stringify(cssContent)};
const jsContent = ${JSON.stringify(jsContent)};
`;

for (const modPath of modules) {
  let code = fs.readFileSync(path.join(rootDir, modPath), 'utf-8');

  // Remove import statements
  code = code.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '');

  // Remove fs.readFileSync for inlined assets in render.js
  code = code.replace(/const\s+cssContent\s*=[\s\S]*?;/g, '// cssContent inlined');
  code = code.replace(/const\s+jsContent\s*=[\s\S]*?;/g, '// jsContent inlined');
  code = code.replace(/const\s+__filename\s*=[\s\S]*?;/g, '');
  code = code.replace(/const\s+__dirname\s*=[\s\S]*?;/g, '');

  // Replace export keywords with local declarations
  code = code.replace(/export\s+function\s+/g, 'function ');
  code = code.replace(/export\s+class\s+/g, 'class ');
  code = code.replace(/export\s+const\s+/g, 'const ');
  code = code.replace(/export\s+let\s+/g, 'let ');
  code = code.replace(/export\s*\{[^}]*\};?/g, '');

  bundle += `\n// --- Module: ${modPath} ---\n` + code.trim() + '\n';
}

bundle += `
// Exports
module.exports = {
  autoDocs,
  describeRoute,
  RouteRegistry,
  buildOpenApiDocument,
  validateOpenApiDocument
};
module.exports.default = autoDocs;
module.exports.autoDocs = autoDocs;
module.exports.describeRoute = describeRoute;
module.exports.RouteRegistry = RouteRegistry;
module.exports.buildOpenApiDocument = buildOpenApiDocument;
module.exports.validateOpenApiDocument = validateOpenApiDocument;
`;

fs.writeFileSync(path.join(rootDir, 'index.cjs'), bundle, 'utf-8');
console.log('Successfully built index.cjs for CommonJS support.');

