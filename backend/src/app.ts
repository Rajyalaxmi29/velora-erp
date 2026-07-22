import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import routes from './routes';

/**
 * Create and configure the Express application.
 * Exported separately from server.ts to allow testing without starting the server.
 */
const app = express();

// ─── Security ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ─────────────────────────────────────────────────────────
app.use(morgan(env.LOG_LEVEL));

// ─── API Routes ──────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Velora ERP API Running"
  });
});

app.use('/api/v1', routes);

// ─── 404 Catch-All ───────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ────────────────────────────────────────────
app.use(errorHandler);

export default app;
