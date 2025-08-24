import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
const router = Router();



/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     operationId: listUsers
 *     description: Returns selectable users for the header user switcher.
 *     responses:
 *       200:
 *         description: Array of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllUsers);

export default router;
