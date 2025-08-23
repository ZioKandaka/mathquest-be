import { Router } from 'express';
import { getProfile } from '../controllers/profile.controller.js';

const router = Router();


/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Get user stats & overall progress
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 */
router.get('/', getProfile);

export default router;
