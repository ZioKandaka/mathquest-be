import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Core middleware
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// API
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
