/**
 * Server-side HTML renderer for the SCOUT-JS interactive documentation UI.
 * Inlines CSS and JS to deliver a 100% offline-ready, CDN-free single page.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache CSS and JS assets in memory for fast retrieval
const cssContent = fs.readFileSync(path.join(__dirname, 'assets', 'style.css'), 'utf-8');
const jsContent = fs.readFileSync(path.join(__dirname, 'assets', 'playground.js'), 'utf-8');

/**
 * Escapes HTML characters for safe rendering.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates a cURL command snippet.
 * @param {string} method 
 * @param {string} endpointPath 
 * @param {Object} operation 
 * @returns {string}
 */
function generateCurl(method, endpointPath, operation) {
  let curl = `curl -X ${method.toUpperCase()} "http://localhost:3000${endpointPath}" \\\n  -H "Accept: application/json"`;
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    curl += ` \\\n  -H "Content-Type: application/json"`;
    if (operation.requestBody?.content?.['application/json']?.schema) {
      curl += ` \\\n  -d '{}'`;
    }
  }
  return curl;
}

/**
 * Renders the interactive documentation UI HTML.
 * 
 * @param {Object} doc - OpenAPI 3.1 document
 * @param {Object} [options={}] - Config options
 * @returns {string} Fully rendered HTML
 */
export function renderDocsHtml(doc, options = {}) {
  const title = escapeHtml(doc.info?.title || 'API Documentation');
  const version = escapeHtml(doc.info?.version || '1.0.0');
  const description = escapeHtml(doc.info?.description || '');
  const theme = options.docs?.theme || 'dark';

  // Group operations by tag
  const tagGroups = {};

  for (const [pathKey, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      const tags = operation.tags?.length ? operation.tags : ['Default'];
      for (const tag of tags) {
        if (!tagGroups[tag]) tagGroups[tag] = [];
        tagGroups[tag].push({
          method: method.toLowerCase(),
          path: pathKey,
          operation,
          id: `${method.toLowerCase()}-${pathKey.replace(/[^a-zA-Z0-9]/g, '-')}`
        });
      }
    }
  }

  // Build sidebar navigation HTML
  let navHtml = '';
  for (const [tag, endpoints] of Object.entries(tagGroups)) {
    navHtml += `<div class="nav-group-title">${escapeHtml(tag)}</div>`;
    for (const ep of endpoints) {
      navHtml += `
        <div class="nav-item" data-target="${ep.id}" data-method="${ep.method}" data-path="${escapeHtml(ep.path)}">
          <span class="badge badge-${ep.method}">${ep.method}</span>
          <span>${escapeHtml(ep.path)}</span>
        </div>
      `;
    }
  }

  // Build endpoint cards HTML
  let cardsHtml = '';
  for (const [tag, endpoints] of Object.entries(tagGroups)) {
    for (const ep of endpoints) {
      const op = ep.operation;
      const pathParams = (op.parameters || []).filter(p => p.in === 'path');
      const queryParams = (op.parameters || []).filter(p => p.in === 'query');
      const curlSnippet = generateCurl(ep.method, ep.path, op);

      // Path parameters table
      let paramsTable = '';
      if (pathParams.length > 0 || queryParams.length > 0) {
        paramsTable = `
          <div class="section-title">Parameters</div>
          <table class="param-table">
            <thead>
              <tr><th>Name</th><th>In</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              ${pathParams.map(p => `
                <tr>
                  <td><span class="param-name">${escapeHtml(p.name)}</span><span class="param-required">*</span></td>
                  <td>path</td>
                  <td>${escapeHtml(p.schema?.type || 'string')}</td>
                  <td>${escapeHtml(p.description || '')}</td>
                </tr>
              `).join('')}
              ${queryParams.map(q => `
                <tr>
                  <td><span class="param-name">${escapeHtml(q.name)}</span>${q.required ? '<span class="param-required">*</span>' : ''}</td>
                  <td>query</td>
                  <td>${escapeHtml(q.schema?.type || 'string')}</td>
                  <td>${escapeHtml(q.description || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      // Playground Inputs
      let pathInputsHtml = '';
      if (pathParams.length > 0) {
        pathInputsHtml = `
          <div class="input-label">Path Parameters:</div>
          ${pathParams.map(p => `
            <input type="text" class="playground-input path-param-input" data-param="${escapeHtml(p.name)}" placeholder="${escapeHtml(p.name)} (required)" />
          `).join('')}
        `;
      }

      let queryInputsHtml = '';
      if (queryParams.length > 0) {
        queryInputsHtml = `
          <div class="input-label">Query Parameters:</div>
          ${queryParams.map(q => `
            <input type="text" class="playground-input query-param-input" data-param="${escapeHtml(q.name)}" placeholder="${escapeHtml(q.name)}" />
          `).join('')}
        `;
      }

      let bodyInputHtml = '';
      if (['post', 'put', 'patch'].includes(ep.method)) {
        bodyInputHtml = `
          <div class="input-label">Request Body (JSON):</div>
          <textarea class="playground-textarea body-textarea" rows="4" placeholder="{}"></textarea>
        `;
      }

      cardsHtml += `
        <div class="endpoint-card" id="${ep.id}" data-method="${ep.method}" data-path="${escapeHtml(ep.path)}" data-summary="${escapeHtml(op.summary || '')}">
          <div class="endpoint-header">
            <div>
              <div class="endpoint-title">
                <span class="badge badge-${ep.method}">${ep.method}</span>
                <span class="endpoint-path">${escapeHtml(ep.path)}</span>
              </div>
              <div class="endpoint-summary">${escapeHtml(op.summary || '')}</div>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(tag)}</div>
          </div>

          <div class="endpoint-body">
            <!-- Documentation Column -->
            <div>
              ${paramsTable}
              <div class="section-title">Example Request (cURL)</div>
              <div class="code-box">${escapeHtml(curlSnippet)}</div>
            </div>

            <!-- Try-It Playground Column -->
            <div class="playground-panel">
              <div class="section-title" style="display:flex; justify-content:space-between;">
                <span>Try It Out</span>
                <span class="status-badge" style="font-weight:600;"></span>
              </div>

              ${pathInputsHtml}
              ${queryInputsHtml}

              <div class="input-label">Authorization Header:</div>
              <input type="text" class="playground-input auth-header-input" placeholder="Bearer your-token or API key" />

              ${bodyInputHtml}

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                <button type="button" class="btn-send">Execute</button>
                <span class="latency-badge" style="font-size:0.75rem; color:var(--text-muted);"></span>
              </div>

              <div class="input-label" style="margin-top:0.5rem;">Response:</div>
              <div class="response-box">(No request sent yet)</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - SCOUT-JS</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-title">
        <span>⚡ ${title}</span>
        <span class="version-badge">v${version}</span>
      </div>
      <button id="theme-toggle" class="theme-toggle" title="Toggle theme">☀️</button>
    </div>
    <div class="search-box">
      <input type="text" id="search-input" class="search-input" placeholder="Search endpoints..." />
    </div>
    <nav class="nav-links">
      ${navHtml}
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <div>
      <h1 style="font-size:1.75rem; font-weight:700; margin-bottom:0.5rem;">${title}</h1>
      <p style="color:var(--text-secondary);">${description}</p>
      <div style="margin-top:0.75rem; display:flex; gap:0.5rem;">
        <a href="./openapi.json" target="_blank" style="font-size:0.8rem; color:var(--accent-color); text-decoration:none;">📄 OpenAPI JSON</a>
        <span style="color:var(--border-color);">|</span>
        <a href="./openapi.yaml" target="_blank" style="font-size:0.8rem; color:var(--accent-color); text-decoration:none;">📝 OpenAPI YAML</a>
        <span style="color:var(--border-color);">|</span>
        <a href="./docs/health" target="_blank" style="font-size:0.8rem; color:var(--accent-color); text-decoration:none;">🩺 Engine Health</a>
      </div>
    </div>

    ${cardsHtml}
  </main>

  <script>
${jsContent}
  </script>
</body>
</html>`;
}

