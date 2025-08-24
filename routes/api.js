import { Router } from 'express';
import lessonsRouter from './lessons.routes.js';
import profileRouter from './profile.routes.js';
import userRouter from './user.routes.js';

const router = Router();

router.use('/lessons', lessonsRouter);
router.use('/profile', profileRouter);
router.use('/users', userRouter);

export default router;
