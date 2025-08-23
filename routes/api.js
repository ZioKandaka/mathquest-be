import { Router } from 'express';
import lessonsRouter from './lessons.routes.js';
import profileRouter from './profile.routes.js';

const router = Router();

router.use('/lessons', lessonsRouter);
router.use('/profile', profileRouter);

export default router;
