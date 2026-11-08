/**
 * Server-side HTML renderer for the SCOUT-JS documentation UI.
 * Delivers the iconic, developer-friendly Swagger UI / FastAPI layout.
 * Pure Vanilla HTML/CSS/JS. 100% offline-ready, zero external CDNs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache CSS and JS assets in memory for high-speed retrieval
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
 * Renders the FastAPI / Swagger UI layout HTML.
 * 
 * @param {Object} doc - OpenAPI 3.1 document
 * @param {Object} [options={}] - Config options
 * @returns {string} Fully rendered HTML
 */
export function renderDocsHtml(doc, options = {}) {
  const title = escapeHtml(doc.info?.title || 'API Documentation');
  const version = escapeHtml(doc.info?.version || '0.1.0');
  const description = escapeHtml(doc.info?.description || 'Auto-generated interactive API documentation.');
  const theme = options.docs?.theme || 'light';
  const openApiPath = options.openapi?.path || '/openapi.json';
  const serverUrl = doc.servers?.[0]?.url || 'http://localhost:3000';

  // Group operations by tag
  const tagGroups = {};

  for (const [pathKey, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      const tags = operation.tags?.length ? operation.tags : ['default'];
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

  // Render Tag Sections and Operations
  let tagSectionsHtml = '';

  for (const [tag, endpoints] of Object.entries(tagGroups)) {
    let operationsHtml = '';

    for (const ep of endpoints) {
      const op = ep.operation;
      const pathParams = (op.parameters || []).filter(p => p.in === 'path');
      const queryParams = (op.parameters || []).filter(p => p.in === 'query');
      const allParams = [...pathParams, ...queryParams];

      // Parameters Table (Swagger style)
      let parametersTableHtml = '';
      if (allParams.length > 0) {
        parametersTableHtml = `
          <div class="op-section-title">Parameters</div>
          <table class="swagger-table">
            <thead>
              <tr>
                <th class="param-col-name">Name</th>
                <th class="param-col-val">Description & Value</th>
              </tr>
            </thead>
            <tbody>
              ${allParams.map(p => {
                const isPath = p.in === 'path';
                const inputClass = isPath ? 'param-input-path' : 'param-input-query';
                const requiredAsterisk = p.required ? '<span class="param-required-tag">* required</span>' : '';
                return `
                  <tr>
                    <td class="param-col-name">
                      <div class="param-name-txt">${escapeHtml(p.name)} ${requiredAsterisk}</div>
                      <div class="param-meta">${escapeHtml(p.schema?.type || 'string')} (${p.in})</div>
                    </td>
                    <td class="param-col-val">
                      <div style="margin-bottom:0.4rem; color:var(--text-secondary);">${escapeHtml(p.description || '')}</div>
                      <input 
                        type="text" 
                        class="param-input-field ${inputClass}" 
                        data-param="${escapeHtml(p.name)}" 
                        placeholder="${escapeHtml(p.name)}${p.required ? ' (required)' : ''}" 
                        disabled 
                      />
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      } else {
        parametersTableHtml = `
          <div class="op-section-title">Parameters</div>
          <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1.5rem;">No parameters</p>
        `;
      }

      // Request Body (Swagger style)
      let requestBodyHtml = '';
      if (['post', 'put', 'patch'].includes(ep.method)) {
        const bodySchema = op.requestBody?.content?.['application/json']?.schema;
        let exampleJson = '{}';
        if (bodySchema && bodySchema.properties) {
          const sample = {};
          for (const [k, v] of Object.entries(bodySchema.properties)) {
            sample[k] = v.type === 'number' || v.type === 'integer' ? 0 : v.type === 'boolean' ? true : 'string';
          }
          exampleJson = JSON.stringify(sample, null, 2);
        }

        requestBodyHtml = `
          <div class="body-container">
            <div class="op-section-title">Request body <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">application/json</span></div>
            <div class="body-editor-wrap">
              <textarea class="body-textarea" placeholder="${escapeHtml(exampleJson)}" disabled></textarea>
            </div>
          </div>
        `;
      }

      // Responses Table (Swagger style)
      let responsesHtml = `
        <div class="op-section-title">Responses</div>
        <table class="swagger-table">
          <thead>
            <tr>
              <th style="width:120px;">Code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(op.responses || { '200': { description: 'Successful Response' } }).map(([code, resp]) => `
              <tr>
                <td><span style="font-weight:700; font-family:monospace;">${escapeHtml(code)}</span></td>
                <td>${escapeHtml(resp.description || 'Response')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // Live Execution / Response Container (FastAPI style)
      const liveResponseHtml = `
        <div class="live-response-box" style="display:none;">
          <div class="live-response-title">Responses</div>
          
          <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">CURL</div>
          <div class="live-code-block">
            <button class="copy-btn">Copy</button>
            <div class="live-curl"></div>
          </div>

          <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">REQUEST URL</div>
          <div class="live-code-block">
            <div class="live-url"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin: 0.75rem 0 0.25rem;">
            <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted);">SERVER RESPONSE</div>
            <div class="live-duration" style="font-size:0.75rem; color:var(--text-secondary);"></div>
          </div>
          <div>
            <span class="live-status-badge status-indicator"></span>
          </div>
          
          <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">RESPONSE BODY</div>
          <div class="live-code-block">
            <button class="copy-btn">Copy</button>
            <div class="live-body"></div>
          </div>

          <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">RESPONSE HEADERS</div>
          <div class="live-code-block">
            <div class="live-headers"></div>
          </div>
        </div>
      `;

      operationsHtml += `
        <div class="op-card op-${ep.method}" id="${ep.id}" data-method="${ep.method}" data-path="${escapeHtml(ep.path)}" data-summary="${escapeHtml(op.summary || '')}">
          <div class="op-header">
            <div class="op-header-left">
              <span class="op-badge op-badge-${ep.method}">${ep.method}</span>
              <span class="op-path">${escapeHtml(ep.path)}</span>
              <span class="op-summary">${escapeHtml(op.summary || '')}</span>
            </div>
            <div class="op-header-right">
              <span class="op-chevron">▼</span>
            </div>
          </div>

          <div class="op-content">
            <div class="op-action-bar">
              <div class="op-desc">${escapeHtml(op.description || op.summary || '')}</div>
              <button type="button" class="btn-try">Try it out</button>
            </div>

            ${parametersTableHtml}
            ${requestBodyHtml}

            <!-- Execute Bar (Initially Hidden) -->
            <div class="execute-bar" style="display:none;">
              <button type="button" class="btn-execute">Execute</button>
              <button type="button" class="btn-clear">Clear</button>
            </div>

            ${liveResponseHtml}
            ${responsesHtml}
          </div>
        </div>
      `;
    }

    tagSectionsHtml += `
      <div class="tag-section">
        <div class="tag-header">
          <div class="tag-title-wrap">
            <span class="tag-title">${escapeHtml(tag)}</span>
            <span class="tag-count">${endpoints.length} endpoint${endpoints.length > 1 ? 's' : ''}</span>
          </div>
          <span class="tag-chevron">▼</span>
        </div>
        <div class="operations-list">
          ${operationsHtml}
        </div>
      </div>
    `;
  }

  // Schemas Section (FastAPI bottom collapsible)
  const schemas = doc.components?.schemas || {};
  let schemasHtml = '';
  if (Object.keys(schemas).length > 0) {
    schemasHtml = `
      <div class="schemas-container collapsed">
        <div class="schemas-header">
          <span>Schemas</span>
          <span>▼</span>
        </div>
        <div class="schemas-content">
          ${Object.entries(schemas).map(([name, schema]) => `
            <div style="margin-bottom:1rem;">
              <div style="font-weight:700; font-family:monospace; margin-bottom:0.25rem;">${escapeHtml(name)}</div>
              <pre class="live-code-block">${escapeHtml(JSON.stringify(schema, null, 2))}</pre>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Swagger UI</title>
  <link rel="icon" type="image/png" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%2349cc90' d='M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z'/></svg>">
  <style>
${cssContent}
  </style>
</head>
<body>
  <!-- Topbar -->
  <header class="topbar">
    <div class="topbar-brand">
      <svg viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z"/>
      </svg>
      <span>SCOUT-JS</span>
    </div>
    <div class="topbar-actions">
      <button id="theme-toggle" class="topbar-btn" title="Toggle Light/Dark Theme">☀️ Light</button>
      <button id="btn-authorize" class="topbar-btn btn-authorize">🔒 Authorize</button>
      <a href="${openApiPath}" target="_blank" class="topbar-btn">📄 openapi.json</a>
      <a href="${openApiPath.replace(/\.json$/, '.yaml')}" target="_blank" class="topbar-btn">📝 openapi.yaml</a>
    </div>
  </header>

  <!-- Main Container -->
  <main class="container">
    <!-- Info Banner -->
    <div class="info-banner">
      <div class="info-title-row">
        <h1 class="info-title">${title}</h1>
        <span class="version-chip">v${version}</span>
        <span class="oas-chip">OAS 3.1.0</span>
        <a href="${openApiPath}" target="_blank" class="spec-link">[ ${openApiPath} ]</a>
      </div>
      <p class="info-description">${description}</p>
      
      <div class="server-selector">
        <span style="font-weight:600; color:var(--text-secondary);">Servers:</span>
        <select class="server-select">
          <option value="${escapeHtml(serverUrl)}">${escapeHtml(serverUrl)}</option>
        </select>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-container">
      <input type="text" id="filter-input" class="filter-input" placeholder="Filter by tag or path..." />
    </div>

    <!-- Tag & Operation Sections -->
    ${tagSectionsHtml}

    <!-- Schemas Section -->
    ${schemasHtml}
  </main>

  <!-- Authorize Modal -->
  <div id="auth-modal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span>Available authorizations</span>
        <button id="auth-close" style="background:none; border:none; cursor:pointer; font-size:1.25rem; color:var(--text-muted);">&times;</button>
      </div>
      <div class="modal-body">
        <div style="font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">HTTP Bearer / API Key</div>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.75rem;">
          Enter your authentication token. It will be sent automatically as the <code>Authorization</code> header on all playground requests.
        </p>
        <input type="text" id="auth-token-input" class="param-input-field" style="max-width:100%;" placeholder="Bearer your-secret-token" />
      </div>
      <div class="modal-footer">
        <button id="auth-save" class="btn-execute" style="padding:0.4rem 1.25rem;">Authorize</button>
      </div>
    </div>
  </div>

  <script>
${jsContent}
  </script>
</body>
</html>`;
}
