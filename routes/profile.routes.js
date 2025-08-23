import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.status(501).json({ todo: 'GET /api/profile' });
});

export default router;
