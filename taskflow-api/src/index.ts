import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'taskflow',
  user: process.env.DB_USER || 'taskflow',
  password: process.env.DB_PASSWORD,
  max: 5
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'unavailable' });
  }
});

app.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, title, completed, created_at FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch {
    res.status(503).json({ error: 'database_unavailable' });
  }
});

app.post('/tasks', async (req: Request, res: Response) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title || title.length > 120) {
    res.status(400).json({ error: 'title_required_max_120' });
    return;
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(503).json({ error: 'database_unavailable' });
  }
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: 'invalid_id' });
    return;
  }
  try {
    const result = await pool.query('SELECT id, title, completed, created_at FROM tasks WHERE id=$1', [id]);
    if (!result.rowCount) { res.status(404).json({ error: 'not_found' }); return; }
    res.json(result.rows[0]);
  } catch {
    res.status(503).json({ error: 'database_unavailable' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`TaskFlow API listening on ${port}`));
