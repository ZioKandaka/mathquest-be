import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.status(501).json({ todo: 'GET /api/lessons' });
});

router.get('/:lessonId', (_req, res) => {
  res.status(501).json({ todo: 'GET /api/lessons/:lessonId' });
});

router.post('/:lessonId/submit', (_req, res) => {
  res.status(501).json({ todo: 'POST /api/lessons/:lessonId/submit' });
});

export default router;
