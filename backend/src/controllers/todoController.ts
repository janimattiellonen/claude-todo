import { Request, Response } from 'express';
import { ITodoService } from '../services/TodoService';

export class TodoController {
  constructor(private todoService: ITodoService) {}

  getAllTodos = async (req: Request, res: Response): Promise<void> => {
    const todos = await this.todoService.getAllTodos();
    res.status(200).json({
      status: 'success',
      data: {
        todos,
        count: todos.length
      }
    });
  };

  getTodoById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const todo = await this.todoService.getTodoById(id);
    res.status(200).json({
      status: 'success',
      data: { todo }
    });
  };

  createTodo = async (req: Request, res: Response): Promise<void> => {
    const todo = await this.todoService.createTodo(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: { todo }
    });
  };

  updateTodo = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const todo = await this.todoService.updateTodo(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Todo updated successfully',
      data: { todo }
    });
  };

  deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.todoService.deleteTodo(id);
    res.status(200).json({
      status: 'success',
      message: 'Todo deleted successfully'
    });
  };

  markAsComplete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const todo = await this.todoService.markAsComplete(id);
    res.status(200).json({
      status: 'success',
      message: 'Todo marked as complete',
      data: { todo }
    });
  };

  markAsIncomplete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const todo = await this.todoService.markAsIncomplete(id);
    res.status(200).json({
      status: 'success',
      message: 'Todo marked as incomplete',
      data: { todo }
    });
  };

  getTodosByPriority = async (req: Request, res: Response): Promise<void> => {
    const priority = parseInt(req.params.priority);
    const todos = await this.todoService.getTodosByPriority(priority);
    res.status(200).json({
      status: 'success',
      data: {
        todos,
        priority,
        count: todos.length
      }
    });
  };

  getPendingTodos = async (req: Request, res: Response): Promise<void> => {
    const todos = await this.todoService.getPendingTodos();
    res.status(200).json({
      status: 'success',
      data: {
        todos,
        count: todos.length
      }
    });
  };

  getCompletedTodos = async (req: Request, res: Response): Promise<void> => {
    const todos = await this.todoService.getCompletedTodos();
    res.status(200).json({
      status: 'success',
      data: {
        todos,
        count: todos.length
      }
    });
  };
}
