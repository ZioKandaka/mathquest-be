import { Router } from 'express';
import { getLessonById, getLessons, submitLesson } from '../controllers/lesson.controller.js';

const router = Router();

router.get('/', getLessons);
router.get('/:lesson_id', getLessonById);
router.post('/:lesson_id/submit', submitLesson);

export default router;
