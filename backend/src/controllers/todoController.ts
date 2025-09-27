import { Request, Response } from 'express';
import { ITodoService } from '../services/TodoService';
import { TodoNotFoundError, ValidationError, DatabaseError } from '../types/errors';

export class TodoController {
  constructor(private todoService: ITodoService) {}

  getAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  };

  getTodoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.getTodoById(id);
      res.json(todo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error fetching todo:', error);
        res.status(500).json({ error: 'Failed to fetch todo' });
      }
    }
  };

  createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
      }
    }
  };

  updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.updateTodo(id, req.body);
      res.json(todo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
      }
    }
  };

  deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.todoService.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
      }
    }
  };

  markAsComplete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.markAsComplete(id);
      res.json(todo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error marking todo as complete:', error);
        res.status(500).json({ error: 'Failed to mark todo as complete' });
      }
    }
  };

  markAsIncomplete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.markAsIncomplete(id);
      res.json(todo);
    } catch (error) {
      if (error instanceof TodoNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error marking todo as incomplete:', error);
        res.status(500).json({ error: 'Failed to mark todo as incomplete' });
      }
    }
  };

  getTodosByPriority = async (req: Request, res: Response): Promise<void> => {
    try {
      const priority = parseInt(req.params.priority);
      const todos = await this.todoService.getTodosByPriority(priority);
      res.json(todos);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error fetching todos by priority:', error);
        res.status(500).json({ error: 'Failed to fetch todos by priority' });
      }
    }
  };

  getPendingTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.todoService.getPendingTodos();
      res.json(todos);
    } catch (error) {
      console.error('Error fetching pending todos:', error);
      res.status(500).json({ error: 'Failed to fetch pending todos' });
    }
  };

  getCompletedTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.todoService.getCompletedTodos();
      res.json(todos);
    } catch (error) {
      console.error('Error fetching completed todos:', error);
      res.status(500).json({ error: 'Failed to fetch completed todos' });
    }
  };
}
