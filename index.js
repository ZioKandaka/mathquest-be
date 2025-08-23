import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import apiRouter from './routes/api.js';
import errorHandler from './middlewares/errorHandler.js';
import { mountDocs } from './helpers/swagger.helper.js';

const app = express();

// Security & CORS
app.use(helmet());
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
app.use(cors({ origin: [FRONTEND_ORIGIN] }));
app.use(express.json({ limit: '1000kb' }));

if (process.env.ENABLE_DOCS !== 'false') {
  mountDocs(app);            
}

// API
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
