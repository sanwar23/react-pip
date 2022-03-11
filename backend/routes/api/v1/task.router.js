import express from 'express';
import TaskController from '../../../app/controllers/task.controller';
import isAuth from '../../../app/middlewares/isAuth';

const args = { mergeParams: true };
const taskRouter = express.Router(args);

taskRouter.route('/create').post(isAuth, TaskController.createNewTask);

taskRouter.route('/list').get(TaskController.getAllTask);

taskRouter.route('/getissue').get(TaskController.getIssue);

taskRouter.route('/update').put(TaskController.updateTask);

export { taskRouter };
