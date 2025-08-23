import { Router } from 'express';
import { getLessonById, getLessons, submitLesson } from '../controllers/lesson.controller.js';

const router = Router();

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: List lessons with progress
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', getLessons);

/**
 * @openapi
 * /api/lessons/{lesson_id}:
 *   get:
 *     summary: Get a lesson with problems (no correct answers)
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:lesson_id', getLessonById);

/**
 * @openapi
 * /api/lessons/{lesson_id}/submit:
 *   post:
 *     summary: Submit answers (idempotent by attempt_id)
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitPayload'
 *     responses:
 *       200:
 *         description: Submission result
 *       409:
 *         description: AttemptMismatch
 */
router.post('/:lesson_id/submit', submitLesson);

export default router;
