import express from 'express';
import { userRouter } from './user.router';
import { taskRouter } from './task.router';

const router = express.Router();
const NAMESPACE = 'v1';

router.use(`/${NAMESPACE}/user`, userRouter);
router.use(`/${NAMESPACE}/task`, taskRouter);

export default router;
