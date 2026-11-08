/**
 * In-browser Docs UI Interactive Script and API Playground.
 * Pure Vanilla JavaScript. Zero CDNs or external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('scout_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  if (themeToggle) {
    themeToggle.textContent = storedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('scout_theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  // 2. Real-time Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const endpointCards = document.querySelectorAll('.endpoint-card');
      const navItems = document.querySelectorAll('.nav-item');

      endpointCards.forEach(card => {
        const path = (card.getAttribute('data-path') || '').toLowerCase();
        const method = (card.getAttribute('data-method') || '').toLowerCase();
        const summary = (card.getAttribute('data-summary') || '').toLowerCase();

        const matches = path.includes(query) || method.includes(query) || summary.includes(query);
        card.style.display = matches ? 'block' : 'none';
      });

      navItems.forEach(item => {
        const path = (item.getAttribute('data-path') || '').toLowerCase();
        const method = (item.getAttribute('data-method') || '').toLowerCase();
        const matches = path.includes(query) || method.includes(query);
        item.style.display = matches ? 'flex' : 'none';
      });
    });
  }

  // 3. Navigation smooth scroll
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // 4. API Playground Execution
  document.querySelectorAll('.btn-send').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.endpoint-card');
      if (!card) return;

      const method = card.getAttribute('data-method').toUpperCase();
      let rawPath = card.getAttribute('data-path');
      const responseContainer = card.querySelector('.response-box');
      const latencyBadge = card.querySelector('.latency-badge');
      const statusBadge = card.querySelector('.status-badge');

      // Security Warning: check mutating requests on production
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      if (isProduction && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const proceed = confirm(`⚠️ Warning: You are about to send a mutating ${method} request to a non-localhost environment (${window.location.host}). Do you want to continue?`);
        if (!proceed) return;
      }

      // Substitute Path Parameters
      const pathInputs = card.querySelectorAll('.path-param-input');
      pathInputs.forEach(input => {
        const paramName = input.getAttribute('data-param');
        const val = input.value.trim();
        rawPath = rawPath.replace(`{${paramName}}`, encodeURIComponent(val || ''));
      });

      // Query Parameters
      const queryInputs = card.querySelectorAll('.query-param-input');
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
      const authInput = card.querySelector('.auth-header-input');
      if (authInput && authInput.value.trim()) {
        headers['Authorization'] = authInput.value.trim();
      }

      // Body
      const bodyInput = card.querySelector('.body-textarea');
      let bodyData = undefined;
      if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {
        headers['Content-Type'] = 'application/json';
        bodyData = bodyInput.value.trim();
      }

      // Send Request
      btn.textContent = 'Sending...';
      btn.disabled = true;
      const startTime = performance.now();

      try {
        const response = await fetch(finalUrl, {
          method,
          headers,
          body: bodyData || undefined
        });

        const duration = Math.round(performance.now() - startTime);
        if (latencyBadge) latencyBadge.textContent = `${duration} ms`;
        if (statusBadge) {
          statusBadge.textContent = `${response.status} ${response.statusText}`;
          statusBadge.style.color = response.ok ? 'var(--badge-get)' : 'var(--badge-delete)';
        }

        const contentType = response.headers.get('content-type') || '';
        let bodyText = '';
        if (contentType.includes('application/json')) {
          const json = await response.json();
          bodyText = JSON.stringify(json, null, 2);
        } else {
          bodyText = await response.text();
        }

        if (responseContainer) {
          responseContainer.textContent = bodyText || '(Empty response body)';
        }
      } catch (err) {
        if (latencyBadge) latencyBadge.textContent = 'Error';
        if (statusBadge) {
          statusBadge.textContent = 'Request Failed';
          statusBadge.style.color = 'var(--badge-delete)';
        }
        if (responseContainer) {
          responseContainer.textContent = `Network / CORS Error: ${err.message}`;
        }
      } finally {
        btn.textContent = 'Execute';
        btn.disabled = false;
      }
    });
  });
});

