import express from 'express';
import { autoDocs, describeRoute } from '../index.js';

const app = express();
app.use(express.json());

// Main router
const apiV1 = express.Router();
const usersRouter = express.Router();
const postsRouter = express.Router();

usersRouter.get('/', describeRoute({
  summary: 'List users',
  tags: ['Users']
}), (req, res) => res.json([]));

usersRouter.get('/:userId/profile', describeRoute({
  summary: 'Get user profile',
  tags: ['Users']
}), (req, res) => res.json({ userId: req.params.userId }));

postsRouter.get('/', describeRoute({
  summary: 'List user posts',
  tags: ['Posts']
}), (req, res) => res.json([]));

postsRouter.post('/', describeRoute({
  summary: 'Create post for user',
  tags: ['Posts']
}), (req, res) => res.status(201).json({ id: 'p1' }));

// Mount sub-routers
usersRouter.use('/:userId/posts', postsRouter);
apiV1.use('/users', usersRouter);
app.use('/api/v1', apiV1);

// Initialize SCOUT-JS
autoDocs(app, {
  info: {
    title: 'Enterprise Nested API',
    version: '2.0.0',
    description: 'Demonstrating nested routers, multi-level parameters, and automatic route tree resolution.'
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Nested API running on http://localhost:${PORT}`);
  console.log(`Interactive Docs: http://localhost:${PORT}/docs`);
});

