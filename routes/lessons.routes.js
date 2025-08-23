import { Router } from 'express';
import { getLessonById, getLessons } from '../controllers/lesson.controller.js';

const router = Router();

router.get('/', getLessons);
router.get('/:lesson_id', getLessonById);

router.post('/:lessonId/submit', (_req, res) => {
  res.status(501).json({ todo: 'POST /api/lessons/:lessonId/submit' });
});

export default router;
