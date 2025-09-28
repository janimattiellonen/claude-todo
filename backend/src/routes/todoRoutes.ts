import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { TodoService } from '../services/TodoService';
import { TodoRepository } from '../repositories/TodoRepository';
import { validateRequest } from '../middleware/validation';
import { sanitizeRequest } from '../middleware/sanitization';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
  priorityParamsSchema,
  queryPaginationSchema
} from '../schemas/todoSchemas';
import db from '../database';

const todoRepository = new TodoRepository(db);
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

const router = Router();

// Apply sanitization to all routes
router.use(sanitizeRequest);

// Todo CRUD operations
router.get('/todos',
  validateRequest(queryPaginationSchema),
  asyncHandler(todoController.getAllTodos)
);

router.get('/todos/:id',
  validateRequest(todoParamsSchema),
  asyncHandler(todoController.getTodoById)
);

router.post('/todos',
  validateRequest(createTodoSchema),
  asyncHandler(todoController.createTodo)
);

router.put('/todos/:id',
  validateRequest(todoParamsSchema.merge(updateTodoSchema)),
  asyncHandler(todoController.updateTodo)
);

router.delete('/todos/:id',
  validateRequest(todoParamsSchema),
  asyncHandler(todoController.deleteTodo)
);

// Todo status operations
router.patch('/todos/:id/complete',
  validateRequest(todoParamsSchema),
  asyncHandler(todoController.markAsComplete)
);

router.patch('/todos/:id/incomplete',
  validateRequest(todoParamsSchema),
  asyncHandler(todoController.markAsIncomplete)
);

// Todo filtering operations
router.get('/todos/priority/:priority',
  validateRequest(priorityParamsSchema.merge(queryPaginationSchema)),
  asyncHandler(todoController.getTodosByPriority)
);

router.get('/todos/status/pending',
  validateRequest(queryPaginationSchema),
  asyncHandler(todoController.getPendingTodos)
);

router.get('/todos/status/completed',
  validateRequest(queryPaginationSchema),
  asyncHandler(todoController.getCompletedTodos)
);

export default router;
