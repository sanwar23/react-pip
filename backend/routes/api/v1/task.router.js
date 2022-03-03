import express from 'express';
// import { isAuthenticated } from './../../../app/middlewares/isAuthenticated';
// import jobController from '../../../app/controllers/job.controller_del';
import TaskController from '../../../app/controllers/task.controller';
import isAuth from '../../../app/middlewares/isAuth';

const args = { mergeParams: true };
const taskRouter = express.Router(args);

taskRouter.route('/').post(isAuth, TaskController.getAllTask);

// jobRouter.route('/:job_id').put(isAuthenticated, jobController.updateJob);

// jobRouter.route('/job/:job_id').get(isAuthenticated, jobController.getJobById);

// jobRouter.route('/:job_id').delete(isAuthenticated, jobController.deleteJob);

// jobRouter
//   .route('/new/job-fields')
//   .get(isAuthenticated, jobController.getJobCategoriesTitlesAndSkills);

// jobRouter.route('/').post(isAuthenticated, jobController.addNewJob);

// jobRouter
//   .route('/categories')
//   .get(isAuthenticated, jobController.getJobCategories);

export { taskRouter };
