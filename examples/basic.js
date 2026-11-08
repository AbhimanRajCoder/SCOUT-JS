import express from 'express';
import { autoDocs, describeRoute } from '../index.js';

const app = express();
app.use(express.json());

// Routes registered before autoDocs
app.get('/users', describeRoute({
  summary: 'List all users',
  tags: ['Users'],
  responses: {
    200: { description: 'Array of user profiles' }
  }
}), (req, res) => {
  res.json([
    { id: '1', name: 'Alice', role: 'admin' },
    { id: '2', name: 'Bob', role: 'developer' }
  ]);
});

app.get('/users/:id', describeRoute({
  summary: 'Get user by ID',
  tags: ['Users'],
  responses: {
    200: { description: 'User found' },
    404: { description: 'User not found' }
  }
}), (req, res) => {
  res.json({ id: req.params.id, name: 'Alice', role: 'admin' });
});

// Initialize SCOUT-JS
autoDocs(app, {
  info: {
    title: 'SCOUT-JS Sample API',
    version: '1.0.0',
    description: 'Example Express API with zero-config interactive documentation.'
  },
  server: {
    url: 'http://localhost:3000'
  }
});

// Route registered after autoDocs
app.post('/users', describeRoute({
  summary: 'Create a new user',
  tags: ['Users'],
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      role: { type: 'string' }
    }
  },
  responses: {
    201: { description: 'User created successfully' }
  }
}), (req, res) => {
  res.status(201).json({ id: '3', ...req.body });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Interactive Docs: http://localhost:${PORT}/docs`);
  console.log(`📄 OpenAPI JSON:     http://localhost:${PORT}/openapi.json`);
  console.log(`📝 OpenAPI YAML:     http://localhost:${PORT}/openapi.yaml`);
  console.log(`🩺 Engine Health:    http://localhost:${PORT}/docs/health`);
});

