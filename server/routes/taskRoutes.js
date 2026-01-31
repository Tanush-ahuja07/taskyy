import express from 'express';
import {getTasks , createTask , updateTask , deleteTask} from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/tasks', authMiddleware, getTasks);
router.post('/tasks', authMiddleware, createTask);
router.get('/tasks/:id', authMiddleware, getTasks);
router.put('/tasks/:id', authMiddleware, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);
export default router;