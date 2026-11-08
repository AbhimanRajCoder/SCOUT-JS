import express from 'express';
import { autoDocs, describeRoute } from '../index.js';

const app = express();
app.use(express.json());

// In-memory data store for live testing
const db = {
  projects: [
    {
      id: 'proj-1',
      title: 'Global Payments Engine',
      description: 'Distributed payment gateway integration with Stripe and Adyen.',
      status: 'active',
      budget: 85000,
      priority: 'critical',
      tags: ['fintech', 'infrastructure', 'node'],
      createdAt: '2026-01-15T09:00:00Z',
      tasks: [
        { id: 'task-101', title: 'Implement idempotency keys', completed: true },
        { id: 'task-102', title: 'Webhook signature validation', completed: false }
      ]
    },
    {
      id: 'proj-2',
      title: 'Customer Analytics Dashboard',
      description: 'Real-time cohort retention and funnel tracking.',
      status: 'paused',
      budget: 32000,
      priority: 'medium',
      tags: ['analytics', 'react', 'dashboard'],
      createdAt: '2026-02-01T14:30:00Z',
      tasks: [
        { id: 'task-201', title: 'Design dark parchment wireframes', completed: true }
      ]
    }
  ],
  auditLogs: []
};

// 1. Projects - Collection Endpoints (GET and POST)
app.get('/api/v1/projects', describeRoute({
  summary: 'List and filter projects',
  description: 'Returns a paginated list of projects with optional status, priority, and text search filters.',
  tags: ['Projects'],
  query: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed', 'archived'],
        description: 'Filter by project lifecycle status'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Filter by project priority level'
      },
      search: {
        type: 'string',
        description: 'Keyword search across title and description'
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Maximum number of items to return (default: 20)'
      },
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Page index for pagination'
      }
    }
  },
  responses: {
    200: {
      description: 'Paginated project collection retrieved successfully',
      body: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          items: {
            type: 'array',
            items: { type: 'object' }
          }
        }
      }
    }
  }
}), (req, res) => {
  let results = [...db.projects];
  const { status, priority, search, limit = 20, page = 1 } = req.query;

  if (status) results = results.filter(p => p.status === status);
  if (priority) results = results.filter(p => p.priority === priority);
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  const offset = (Number(page) - 1) * Number(limit);
  const paginated = results.slice(offset, offset + Number(limit));

  res.json({
    total: results.length,
    page: Number(page),
    limit: Number(limit),
    items: paginated
  });
});

app.post('/api/v1/projects', describeRoute({
  summary: 'Create a new project',
  description: 'Creates a project record with budget, priority, tags, and timeline.',
  tags: ['Projects'],
  body: {
    type: 'object',
    required: ['title', 'budget', 'priority'],
    properties: {
      title: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: 'Short human-readable project title'
      },
      description: {
        type: 'string',
        description: 'Detailed scope and technical requirements'
      },
      budget: {
        type: 'number',
        minimum: 1000,
        description: 'Allocated budget in USD'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Urgency rating'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Categorization tags'
      }
    }
  },
  responses: {
    201: { description: 'Project created successfully' },
    400: { description: 'Validation error: required fields missing or out of bounds' }
  }
}), (req, res) => {
  const { title, description = '', budget, priority = 'medium', tags = [] } = req.body;
  if (!title || !budget) {
    return res.status(400).json({ error: 'Missing required fields: title and budget are required.' });
  }

  const newProject = {
    id: `proj-${db.projects.length + 1}`,
    title,
    description,
    status: 'active',
    budget: Number(budget),
    priority,
    tags,
    createdAt: new Date().toISOString(),
    tasks: []
  };

  db.projects.push(newProject);
  res.status(201).json(newProject);
});

// 2. Project Item Endpoints (GET, PUT, PATCH, DELETE, HEAD)
app.get('/api/v1/projects/:projectId', describeRoute({
  summary: 'Retrieve project by ID',
  description: 'Fetches full metadata, budget, and task list for a given project identifier.',
  tags: ['Projects'],
  responses: {
    200: { description: 'Project record found' },
    404: { description: 'Project not found with the specified ID' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: `Project not found with ID '${req.params.projectId}'` });
  }
  res.json(project);
});

app.put('/api/v1/projects/:projectId', describeRoute({
  summary: 'Replace project (Full update)',
  description: 'Replaces all attributes of the project with the supplied payload.',
  tags: ['Projects'],
  body: {
    type: 'object',
    required: ['title', 'description', 'budget', 'priority', 'status'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      budget: { type: 'number' },
      priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      status: { type: 'string', enum: ['active', 'paused', 'completed', 'archived'] },
      tags: { type: 'array', items: { type: 'string' } }
    }
  },
  responses: {
    200: { description: 'Project updated successfully' },
    404: { description: 'Project ID does not exist' }
  }
}), (req, res) => {
  const index = db.projects.findIndex(p => p.id === req.params.projectId);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id: req.params.projectId,
    updatedAt: new Date().toISOString()
  };

  res.json(db.projects[index]);
});

app.patch('/api/v1/projects/:projectId/status', describeRoute({
  summary: 'Update project lifecycle status',
  description: 'Mutates only the status field of a project without modifying other fields.',
  tags: ['Projects'],
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed', 'archived'],
        description: 'New target lifecycle status'
      },
      reason: {
        type: 'string',
        description: 'Audit justification for status change'
      }
    }
  },
  responses: {
    200: { description: 'Status updated successfully' },
    400: { description: 'Invalid status transition' },
    404: { description: 'Project not found' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  project.status = req.body.status;
  project.updatedAt = new Date().toISOString();
  db.auditLogs.push({
    action: 'status_change',
    projectId: req.params.projectId,
    status: req.body.status,
    reason: req.body.reason || 'Not specified',
    timestamp: new Date().toISOString()
  });

  res.json({ message: 'Status updated successfully', project });
});

app.delete('/api/v1/projects/:projectId', describeRoute({
  summary: 'Delete project',
  description: 'Permanently removes a project and its associated sub-tasks.',
  tags: ['Projects'],
  responses: {
    204: { description: 'Project deleted successfully. No response body.' },
    404: { description: 'Project not found' }
  }
}), (req, res) => {
  const index = db.projects.findIndex(p => p.id === req.params.projectId);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.projects.splice(index, 1);
  res.status(204).send();
});

app.head('/api/v1/projects/:projectId', describeRoute({
  summary: 'Check project existence and ETag',
  description: 'Returns HTTP headers and status code without sending the response body.',
  tags: ['Projects'],
  responses: {
    200: { description: 'Project exists' },
    404: { description: 'Project does not exist' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).end();
  }
  res.setHeader('ETag', `"etag-${project.id}-${project.status}"`);
  res.setHeader('X-Project-Status', project.status);
  res.status(200).end();
});

// 3. Sub-Router for Project Tasks
const tasksRouter = express.Router({ mergeParams: true });

tasksRouter.get('/', describeRoute({
  summary: 'List project tasks',
  description: 'Fetches all tasks scoped under a specific parent project.',
  tags: ['Tasks'],
  responses: {
    200: { description: 'List of task objects' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Parent project not found' });
  res.json(project.tasks || []);
});

tasksRouter.post('/', describeRoute({
  summary: 'Create task under project',
  description: 'Appends a new task item to the parent project task list.',
  tags: ['Tasks'],
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', description: 'Task title' },
      completed: { type: 'boolean', description: 'Initial completion state' }
    }
  },
  responses: {
    201: { description: 'Task added successfully' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Parent project not found' });

  const newTask = {
    id: `task-${Date.now()}`,
    title: req.body.title,
    completed: Boolean(req.body.completed)
  };

  project.tasks.push(newTask);
  res.status(201).json(newTask);
});

tasksRouter.delete('/:taskId', describeRoute({
  summary: 'Delete project task',
  description: 'Removes a specific task from a project.',
  tags: ['Tasks'],
  responses: {
    200: { description: 'Task deleted' },
    404: { description: 'Task not found' }
  }
}), (req, res) => {
  const project = db.projects.find(p => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Parent project not found' });

  const taskIdx = project.tasks.findIndex(t => t.id === req.params.taskId);
  if (taskIdx === -1) return res.status(404).json({ error: 'Task not found' });

  project.tasks.splice(taskIdx, 1);
  res.json({ message: 'Task deleted successfully' });
});

app.use('/api/v1/projects/:projectId/tasks', tasksRouter);

// 4. Route Chaining with app.route()
app.route('/api/v1/reports')
  .get(describeRoute({
    summary: 'Generate analytics report',
    description: 'Calculates active projects, total budget allocation, and task progress.',
    tags: ['Analytics & Reports'],
    query: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['json', 'summary'] }
      }
    },
    responses: { 200: { description: 'Analytics aggregation' } }
  }), (req, res) => {
    const totalBudget = db.projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const activeProjects = db.projects.filter(p => p.status === 'active').length;
    res.json({
      reportGeneratedAt: new Date().toISOString(),
      activeProjects,
      totalProjects: db.projects.length,
      totalBudgetAllocatedUSD: totalBudget
    });
  })
  .post(describeRoute({
    summary: 'Schedule automated export report',
    description: 'Enqueues an asynchronous report generation job sent via email or webhook.',
    tags: ['Analytics & Reports'],
    body: {
      type: 'object',
      required: ['recipientEmail', 'frequency'],
      properties: {
        recipientEmail: { type: 'string', format: 'email' },
        frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] }
      }
    },
    responses: { 202: { description: 'Job enqueued' } }
  }), (req, res) => {
    res.status(202).json({
      jobId: `job-${Date.now()}`,
      status: 'enqueued',
      recipientEmail: req.body.recipientEmail,
      frequency: req.body.frequency
    });
  });

// 5. Additional Verbs: OPTIONS and ALL
app.options('/api/v1/capabilities', describeRoute({
  summary: 'API capabilities discovery',
  description: 'Returns supported HTTP verbs and capabilities header for CORS and service discovery.',
  tags: ['System'],
  responses: { 200: { description: 'Capabilities header returned' } }
}), (req, res) => {
  res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('X-Service-Version', '1.0.0');
  res.status(200).json({
    allowedVerbs: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    protocols: ['HTTP/1.1', 'HTTP/2'],
    documentation: '/docs'
  });
});

app.all('/api/v1/webhooks/listener', describeRoute({
  summary: 'Catch-all webhook listener',
  description: 'Accepts inbound webhook payloads across any HTTP verb (GET, POST, PUT, DELETE).',
  tags: ['Webhooks'],
  responses: { 200: { description: 'Webhook acknowledged' } }
}), (req, res) => {
  res.json({
    acknowledged: true,
    method: req.method,
    headersReceived: Object.keys(req.headers).length,
    timestamp: new Date().toISOString()
  });
});

// 6. Initialize SCOUT-JS AutoDocs
autoDocs(app, {
  info: {
    title: 'Enterprise Task & Project Management API',
    version: '1.4.0',
    description: 'High-throughput project management service with real-time route discovery, parameter validation, and OpenAPI 3.1 generation.'
  },
  server: {
    url: 'http://localhost:3000',
    description: 'Local development server'
  },
  security: {
    schemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your authorization JWT token'
      }
    }
  }
});

// 7. Route added AFTER autoDocs initialization to demonstrate dynamic discovery
app.get('/api/v1/system/ping', describeRoute({
  summary: 'Service heartbeat ping',
  description: 'Healthcheck route registered dynamically after autoDocs() was initialized.',
  tags: ['System'],
  responses: { 200: { description: 'Service is alive and healthy' } }
}), (req, res) => {
  res.json({
    alive: true,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Interactive Docs: http://localhost:${PORT}/docs`);
  console.log(`OpenAPI JSON:     http://localhost:${PORT}/openapi.json`);
  console.log(`OpenAPI YAML:     http://localhost:${PORT}/openapi.yaml`);
  console.log(`Engine Health:    http://localhost:${PORT}/docs/health`);
});
