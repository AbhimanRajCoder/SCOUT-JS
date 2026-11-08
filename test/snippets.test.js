import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { autoDocs, describeRoute } from '../index.js';
import { renderDocsHtml } from '../lib/ui/render.js';

describe('Multi-Language Code Snippets (Phase 2)', () => {
  let app;
  let server;
  let baseUrl;
  let instance;

  before(async () => {
    app = express();
    app.use(express.json());

    app.get('/api/users/:id', describeRoute({
      summary: 'Get user by ID',
      tags: ['Users'],
      responses: { 200: { description: 'Success' } }
    }), (req, res) => res.json({ id: req.params.id }));

    app.post('/api/users', describeRoute({
      summary: 'Create user',
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        }
      },
      responses: { 201: { description: 'Created' } }
    }), (req, res) => res.status(201).json(req.body));

    instance = autoDocs(app, {
      info: { title: 'Snippet Test API', version: '2.0.0' }
    });

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    instance.close();
    await new Promise((resolve) => server.close(resolve));
  });

  test('renderDocsHtml embeds multi-language snippet containers and tabs', () => {
    const doc = instance.getDocument();
    const html = renderDocsHtml(doc);

    // Verify Snippet Section exists
    assert.ok(html.includes('snippets-section'), 'Should render snippets-section container');
    assert.ok(html.includes('snippet-lang-tabs'), 'Should render language tab bar');
    assert.ok(html.includes('Code Snippets'), 'Should have Code Snippets heading');

    // Verify all 5 supported languages are present
    assert.ok(html.includes('data-lang="curl">cURL<'), 'cURL language tab must exist');
    assert.ok(html.includes('data-lang="fetch">Fetch<'), 'Fetch language tab must exist');
    assert.ok(html.includes('data-lang="axios">Axios<'), 'Axios language tab must exist');
    assert.ok(html.includes('data-lang="python">Python<'), 'Python language tab must exist');
    assert.ok(html.includes('data-lang="go">Go<'), 'Go language tab must exist');

    // Verify copy button for snippets
    assert.ok(html.includes('snippet-copy-btn'), 'Should render copy button for snippet');
    assert.ok(html.includes('snippet-code-content'), 'Should render pre container for generated code');
  });

  test('served /docs contains live client-side snippet generator code', async () => {
    const res = await fetch(`${baseUrl}/docs`);
    assert.equal(res.status, 200);
    const html = await res.text();

    assert.ok(html.includes('generateSnippet'), 'HTML bundle must contain client-side snippet generator');
    assert.ok(html.includes('updateCardSnippet'), 'HTML bundle must contain dynamic snippet updater');
    assert.ok(html.includes('scout_snippet_lang'), 'HTML bundle must support language persistence');
  });
});

