import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { TodoService } from '../services/TodoService';
import { TodoRepository } from '../repositories/TodoRepository';
import db from '../database';

const todoRepository = new TodoRepository(db);
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

const router = Router();

router.get('/todos', todoController.getAllTodos);
router.get('/todos/:id', todoController.getTodoById);
router.post('/todos', todoController.createTodo);
router.put('/todos/:id', todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.patch('/todos/:id/complete', todoController.markAsComplete);
router.patch('/todos/:id/incomplete', todoController.markAsIncomplete);
router.get('/todos/priority/:priority', todoController.getTodosByPriority);
router.get('/todos/status/pending', todoController.getPendingTodos);
router.get('/todos/status/completed', todoController.getCompletedTodos);

export default router;
