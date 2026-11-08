/**
 * FastAPI / Swagger UI Interactive Engine for SCOUT-JS.
 * Pure Vanilla JavaScript. Zero external CDNs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global auth state
  let globalAuthToken = localStorage.getItem('scout_auth_token') || '';

  // 1. Theme Management (Light / Dark)
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('scout_theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);
  if (themeToggle) {
    themeToggle.textContent = 'Theme: ' + (storedTheme === 'dark' ? 'Light' : 'Dark');
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('scout_theme', next);
      themeToggle.textContent = 'Theme: ' + (next === 'dark' ? 'Light' : 'Dark');
    });
  }

  // 2. Authorize Modal
  const authModal = document.getElementById('auth-modal');
  const authBtn = document.getElementById('btn-authorize');
  const authClose = document.getElementById('auth-close');
  const authSave = document.getElementById('auth-save');
  const authInput = document.getElementById('auth-token-input');

  if (authInput && globalAuthToken) {
    authInput.value = globalAuthToken;
    if (authBtn) authBtn.textContent = 'Authorized';
  }

  if (authBtn && authModal) {
    authBtn.addEventListener('click', () => {
      authModal.classList.add('open');
    });
  }

  if (authClose && authModal) {
    authClose.addEventListener('click', () => {
      authModal.classList.remove('open');
    });
  }

  if (authSave && authModal && authInput) {
    authSave.addEventListener('click', () => {
      globalAuthToken = authInput.value.trim();
      localStorage.setItem('scout_auth_token', globalAuthToken);
      authModal.classList.remove('open');
      if (authBtn) {
        authBtn.textContent = globalAuthToken ? 'Authorized' : 'Authorize';
      }
      if (typeof updateAllSnippets === 'function') {
        updateAllSnippets();
      }
    });
  }

  // 3. Tag Section Expand / Collapse
  document.querySelectorAll('.tag-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.tag-section');
      if (section) {
        section.classList.toggle('collapsed');
      }
    });
  });

  // 4. Operation Card Expand / Collapse
  document.querySelectorAll('.op-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.op-anchor')) return; // Don't toggle on anchor click
      const card = header.closest('.op-card');
      if (card) {
        card.classList.toggle('expanded');
      }
    });
  });

  // 4b. Global Expand All / Collapse All Controls
  const btnExpandAll = document.getElementById('btn-expand-all');
  const btnCollapseAll = document.getElementById('btn-collapse-all');

  if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
      document.querySelectorAll('.tag-section').forEach(s => s.classList.remove('collapsed'));
      document.querySelectorAll('.op-card').forEach(c => c.classList.add('expanded'));
    });
  }

  if (btnCollapseAll) {
    btnCollapseAll.addEventListener('click', () => {
      document.querySelectorAll('.op-card').forEach(c => c.classList.remove('expanded'));
    });
  }

  // 4c. Deep Linking / Hash Navigation
  function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const targetCard = document.getElementById(hash);
    if (targetCard && targetCard.classList.contains('op-card')) {
      const parentSection = targetCard.closest('.tag-section');
      if (parentSection) parentSection.classList.remove('collapsed');
      targetCard.classList.add('expanded');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  window.addEventListener('hashchange', handleHashNavigation);
  setTimeout(handleHashNavigation, 100);

  // 5. Schemas Section Toggle
  const schemasHeader = document.querySelector('.schemas-header');
  if (schemasHeader) {
    schemasHeader.addEventListener('click', () => {
      const container = schemasHeader.closest('.schemas-container');
      if (container) {
        container.classList.toggle('collapsed');
      }
    });
  }

  // 6. Fast Real-Time Filter
  const filterInput = document.getElementById('filter-input');
  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const sections = document.querySelectorAll('.tag-section');

      sections.forEach(section => {
        let visibleOps = 0;
        const ops = section.querySelectorAll('.op-card');

        ops.forEach(op => {
          const path = (op.getAttribute('data-path') || '').toLowerCase();
          const method = (op.getAttribute('data-method') || '').toLowerCase();
          const summary = (op.getAttribute('data-summary') || '').toLowerCase();

          const matches = path.includes(query) || method.includes(query) || summary.includes(query);
          op.style.display = matches ? 'block' : 'none';
          if (matches) visibleOps++;
        });

        section.style.display = visibleOps > 0 ? 'block' : 'none';
      });
    });
  }

  // 7. "Try it out" / "Cancel" Handler
  document.querySelectorAll('.btn-try').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.op-card');
      if (!card) return;

      const isTrying = btn.classList.toggle('active');
      btn.textContent = isTrying ? 'Cancel' : 'Try it out';

      // Toggle input fields
      const inputs = card.querySelectorAll('.param-input-field, .body-textarea');
      inputs.forEach(input => {
        input.disabled = !isTrying;
      });

      // Pre-fill body textarea with placeholder JSON if empty
      const bodyTextarea = card.querySelector('.body-textarea');
      if (isTrying && bodyTextarea && !bodyTextarea.value.trim()) {
        const ph = bodyTextarea.getAttribute('placeholder');
        if (ph && ph !== '{}') {
          bodyTextarea.value = ph;
        }
      }

      // Show/hide execute bar
      const executeBar = card.querySelector('.execute-bar');
      if (executeBar) {
        executeBar.style.display = isTrying ? 'flex' : 'none';
      }
    });
  });

  // 8. Execute Request (Playground Execution)
  document.querySelectorAll('.btn-execute').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.op-card');
      if (!card) return;

      const method = card.getAttribute('data-method').toUpperCase();
      let rawPath = card.getAttribute('data-path');

      // Security Warning on non-localhost for mutating methods
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      if (isProduction && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const proceed = confirm(`Warning: You are about to send a mutating ${method} request to ${window.location.host}. Do you want to continue?`);
        if (!proceed) return;
      }

      // Check required path parameters
      let missingParam = false;
      const pathInputs = card.querySelectorAll('.param-input-path');
      pathInputs.forEach(input => {
        const paramName = input.getAttribute('data-param');
        const val = input.value.trim();
        if (!val) {
          input.style.borderColor = '#f93e3e';
          missingParam = true;
        } else {
          input.style.borderColor = '';
          rawPath = rawPath.replace(`{${paramName}}`, encodeURIComponent(val));
        }
      });

      if (missingParam) {
        alert('Please fill in all required path parameters before executing.');
        return;
      }

      // Query parameters
      const queryInputs = card.querySelectorAll('.param-input-query');
      const queryParams = new URLSearchParams();
      queryInputs.forEach(input => {
        const paramName = input.getAttribute('data-param');
        const val = input.value.trim();
        if (val) queryParams.append(paramName, val);
      });
      const queryString = queryParams.toString();
      const finalUrl = rawPath + (queryString ? `?${queryString}` : '');

      // Headers
      const headers = { 'Accept': 'application/json' };
      if (globalAuthToken) {
        headers['Authorization'] = globalAuthToken.startsWith('Bearer ') || globalAuthToken.startsWith('Basic ')
          ? globalAuthToken 
          : `Bearer ${globalAuthToken}`;
      }

      // Endpoint-specific Header parameters
      const headerInputs = card.querySelectorAll('.param-input-header');
      headerInputs.forEach(input => {
        const paramName = input.getAttribute('data-param');
        const val = input.value.trim();
        if (val) headers[paramName] = val;
      });

      // Mock Mode Toggle (Phase 4)
      const mockCheckbox = card.querySelector('.mock-checkbox');
      const isMockMode = Boolean(mockCheckbox && mockCheckbox.checked);
      if (isMockMode) {
        headers['X-Scout-Mock'] = 'true';
      }

      // Body
      const bodyInput = card.querySelector('.body-textarea');
      let bodyData = undefined;
      if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {
        headers['Content-Type'] = 'application/json';
        bodyData = bodyInput.value.trim();
      }

      // Resolve Base Server URL
      const serverSelect = document.querySelector('.server-select');
      const selectedServerUrl = (serverSelect && serverSelect.value) ? serverSelect.value.trim() : window.location.origin;
      const targetOrigin = selectedServerUrl.startsWith('http') ? selectedServerUrl.replace(/\/+$/, '') : window.location.origin;
      const fullExecutionUrl = selectedServerUrl.startsWith('http') ? `${targetOrigin}${finalUrl}` : finalUrl;

      // Generate cURL
      let curlCmd = `curl -X '${method}' \\\n  '${targetOrigin}${finalUrl}'`;
      for (const [k, v] of Object.entries(headers)) {
        curlCmd += ` \\\n  -H '${k}: ${v}'`;
      }
      if (bodyData) {
        curlCmd += ` \\\n  -d '${bodyData.replace(/'/g, "'\\''")}'`;
      }

      // Update Live Response UI
      const liveBox = card.querySelector('.live-response-box');
      const curlBox = card.querySelector('.live-curl');
      const urlBox = card.querySelector('.live-url');
      const statusBadge = card.querySelector('.live-status-badge');
      const bodyBox = card.querySelector('.live-body');
      const headersBox = card.querySelector('.live-headers');
      const durationBadge = card.querySelector('.live-duration');

      if (liveBox) liveBox.style.display = 'block';
      if (curlBox) curlBox.textContent = curlCmd;
      if (urlBox) urlBox.textContent = `${targetOrigin}${finalUrl}`;

      btn.textContent = 'Executing...';
      btn.disabled = true;
      const startTime = performance.now();

      try {
        const res = await fetch(fullExecutionUrl, {
          method,
          headers,
          body: bodyData || undefined
        });

        const duration = Math.round(performance.now() - startTime);
        if (durationBadge) durationBadge.textContent = `${duration} ms`;

        const isMockResponse = res.headers.get('x-scout-mock') === 'true';

        if (statusBadge) {
          statusBadge.innerHTML = `${res.status} ${res.statusText}${isMockResponse ? '<span class="status-mock-badge">MOCK</span>' : ''}`;
          statusBadge.className = 'status-indicator ' + (res.ok ? 'status-2xx' : 'status-4xx');
        }

        const contentType = res.headers.get('content-type') || '';
        let resBody = '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          resBody = JSON.stringify(json, null, 2);
        } else {
          resBody = await res.text();
        }

        if (bodyBox) bodyBox.textContent = resBody || '(Empty response body)';

        // Format headers
        if (headersBox) {
          let hText = '';
          res.headers.forEach((v, k) => {
            hText += `${k}: ${v}\n`;
          });
          headersBox.textContent = hText.trim() || '(No headers)';
        }
      } catch (err) {
        if (statusBadge) {
          statusBadge.textContent = 'Network Error';
          statusBadge.className = 'status-indicator status-5xx';
        }
        if (bodyBox) {
          bodyBox.textContent = `Fetch Failed: ${err.message}`;
        }
      } finally {
        btn.textContent = 'Execute';
        btn.disabled = false;
      }
    });
  });

  // 9. Clear Response Handler
  document.querySelectorAll('.btn-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.op-card');
      if (!card) return;
      const liveBox = card.querySelector('.live-response-box');
      if (liveBox) liveBox.style.display = 'none';
    });
  });

  // 10. Copy cURL Helper
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const codeBlock = btn.closest('.live-code-block');
      if (!codeBlock) return;
      const text = codeBlock.textContent.replace('Copy', '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });

  // 11. Schema / Example Value Tab Switcher
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = tab.closest('.tab-wrapper');
      if (!wrapper) return;
      wrapper.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      wrapper.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPane = wrapper.querySelector(targetId);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // 12. Multi-Language Code Snippet Generator (Phase 2)
  let activeSnippetLang = localStorage.getItem('scout_snippet_lang') || 'curl';

  function generateSnippet(lang, method, url, headers = {}, body = '') {
    const methodUpper = method.toUpperCase();
    const methodLower = method.toLowerCase();
    const hasBody = Boolean(body && ['POST', 'PUT', 'PATCH'].includes(methodUpper));

    switch (lang) {
      case 'curl': {
        let cmd = `curl -X '${methodUpper}' \\\n  '${url}'`;
        for (const [k, v] of Object.entries(headers)) {
          cmd += ` \\\n  -H '${k}: ${v}'`;
        }
        if (hasBody) {
          cmd += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
        }
        return cmd;
      }

      case 'fetch': {
        const headerEntries = Object.entries(headers);
        let headerLines = headerEntries.length
          ? '  headers: {\n' + headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n') + '\n  }'
          : '';

        let options = `  method: '${methodUpper}'`;
        if (headerLines) options += `,\n${headerLines}`;
        if (hasBody) {
          let parsed = null;
          try { parsed = JSON.parse(body); } catch (_) {}
          const bodyFormatted = parsed
            ? JSON.stringify(parsed, null, 2).split('\n').map((line, idx) => idx === 0 ? line : '    ' + line).join('\n')
            : JSON.stringify(body);
          options += `,\n  body: JSON.stringify(${bodyFormatted})`;
        }

        return `const response = await fetch('${url}', {\n${options}\n});\nconst data = await response.json();\nconsole.log(data);`;
      }

      case 'axios': {
        const headerEntries = Object.entries(headers);
        let headerLines = headerEntries.length
          ? '  headers: {\n' + headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n') + '\n  }'
          : '';

        let config = `  method: '${methodLower}',\n  url: '${url}'`;
        if (headerLines) config += `,\n${headerLines}`;
        if (hasBody) {
          let parsed = null;
          try { parsed = JSON.parse(body); } catch (_) {}
          const dataFormatted = parsed
            ? JSON.stringify(parsed, null, 2).split('\n').map((line, idx) => idx === 0 ? line : '  ' + line).join('\n')
            : JSON.stringify(body);
          config += `,\n  data: ${dataFormatted}`;
        }

        return `import axios from 'axios';\n\nconst response = await axios({\n${config}\n});\nconsole.log(response.data);`;
      }

      case 'python': {
        const headerEntries = Object.entries(headers);
        let headerBlock = headerEntries.length
          ? 'headers = {\n' + headerEntries.map(([k, v]) => `    "${k}": "${v}"`).join(',\n') + '\n}\n'
          : '';

        let code = `import requests\n\nurl = "${url}"\n${headerBlock}`;
        if (hasBody) {
          let parsed = null;
          try { parsed = JSON.parse(body); } catch (_) {}
          const payloadFormatted = parsed ? JSON.stringify(parsed, null, 4) : JSON.stringify(body);
          code += `payload = ${payloadFormatted}\n\n`;
          code += `response = requests.${methodLower}(url, ${headerEntries.length ? 'headers=headers, ' : ''}json=payload)\nprint(response.json())`;
        } else {
          code += `\nresponse = requests.${methodLower}(url${headerEntries.length ? ', headers=headers' : ''})\nprint(response.json())`;
        }
        return code;
      }

      case 'go': {
        const headerLines = Object.entries(headers)
          .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
          .join('\n');

        let bodySetup = `\tvar reqBody io.Reader = nil\n`;
        if (hasBody) {
          bodySetup = `\treqBody := bytes.NewBuffer([]byte(\`${body}\`))\n`;
        }

        return `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${url}"\n${bodySetup}\n\treq, err := http.NewRequest("${methodUpper}", url, ${hasBody ? 'reqBody' : 'nil'})\n\tif err != nil {\n\t\tpanic(err)\n\t}\n${headerLines ? '\n' + headerLines + '\n' : ''}\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;
      }

      default:
        return '';
    }
  }

  function updateCardSnippet(card) {
    if (!card) return;
    const method = card.getAttribute('data-method').toUpperCase();
    let rawPath = card.getAttribute('data-path') || '';

    // Interpolate path parameters
    const pathInputs = card.querySelectorAll('.param-input-path');
    pathInputs.forEach(input => {
      const paramName = input.getAttribute('data-param');
      const val = input.value.trim() || input.getAttribute('placeholder') || `{${paramName}}`;
      const cleanVal = val.replace(' (required)', '');
      rawPath = rawPath.replace(`{${paramName}}`, encodeURIComponent(cleanVal));
    });

    // Query parameters
    const queryInputs = card.querySelectorAll('.param-input-query');
    const queryParams = new URLSearchParams();
    queryInputs.forEach(input => {
      const paramName = input.getAttribute('data-param');
      const val = input.value.trim();
      if (val) queryParams.append(paramName, val);
    });
    const queryString = queryParams.toString();
    const finalPath = rawPath + (queryString ? `?${queryString}` : '');

    // Server origin
    const serverSelect = document.querySelector('.server-select');
    const selectedServerUrl = (serverSelect && serverSelect.value) ? serverSelect.value.trim() : window.location.origin;
    const targetOrigin = selectedServerUrl.startsWith('http') ? selectedServerUrl.replace(/\/+$/, '') : window.location.origin;
    const fullUrl = `${targetOrigin}${finalPath}`;

    // Headers
    const headers = { 'Accept': 'application/json' };
    if (globalAuthToken) {
      headers['Authorization'] = globalAuthToken.startsWith('Bearer ') || globalAuthToken.startsWith('Basic ')
        ? globalAuthToken 
        : `Bearer ${globalAuthToken}`;
    }

    const headerInputs = card.querySelectorAll('.param-input-header');
    headerInputs.forEach(input => {
      const paramName = input.getAttribute('data-param');
      const val = input.value.trim();
      if (val) headers[paramName] = val;
    });

    // Body
    const bodyInput = card.querySelector('.body-textarea');
    let bodyData = '';
    if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {
      headers['Content-Type'] = 'application/json';
      bodyData = bodyInput.value.trim() || bodyInput.getAttribute('placeholder') || '{}';
      if (bodyData === '{}') bodyData = '';
    }

    // Set active tab styling
    card.querySelectorAll('.snippet-tab-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', lang === activeSnippetLang);
    });

    // Render snippet
    const codePre = card.querySelector('.snippet-code-content');
    if (codePre) {
      codePre.textContent = generateSnippet(activeSnippetLang, method, fullUrl, headers, bodyData);
    }
  }

  function updateAllSnippets() {
    document.querySelectorAll('.op-card').forEach(updateCardSnippet);
  }

  // Snippet Tab Clicks
  document.querySelectorAll('.snippet-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;
      activeSnippetLang = lang;
      localStorage.setItem('scout_snippet_lang', lang);
      updateAllSnippets();
    });
  });

  // Dynamic updates on user input
  document.querySelectorAll('.param-input-field, .body-textarea').forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.op-card');
      if (card) updateCardSnippet(card);
    });
    input.addEventListener('change', () => {
      const card = input.closest('.op-card');
      if (card) updateCardSnippet(card);
    });
  });

  const serverSelectElem = document.querySelector('.server-select');
  if (serverSelectElem) {
    serverSelectElem.addEventListener('change', updateAllSnippets);
  }

  // Initialize all snippets on load
  updateAllSnippets();
});
