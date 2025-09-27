import { Todo, CreateTodo, UpdateTodo } from '../models/Todo';
import { ITodoRepository } from '../repositories/TodoRepository';
import { TodoNotFoundError, ValidationError } from '../types/errors';

export interface ITodoService {
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: number): Promise<Todo>;
  createTodo(todoData: CreateTodo): Promise<Todo>;
  updateTodo(id: number, todoData: UpdateTodo): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
  markAsComplete(id: number): Promise<Todo>;
  markAsIncomplete(id: number): Promise<Todo>;
  getTodosByPriority(priority: number): Promise<Todo[]>;
  getPendingTodos(): Promise<Todo[]>;
  getCompletedTodos(): Promise<Todo[]>;
}

export class TodoService implements ITodoService {
  constructor(private todoRepository: ITodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return await this.todoRepository.findAll();
  }

  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }
    return todo;
  }

  async createTodo(todoData: CreateTodo): Promise<Todo> {
    // Validate required fields
    if (!todoData.title || todoData.title.trim() === '') {
      throw new ValidationError('Title is required');
    }

    // Validate priority range
    if (todoData.priority !== undefined && (todoData.priority < 1 || todoData.priority > 10)) {
      throw new ValidationError('Priority must be between 1 and 10');
    }

    // Set default values
    const todoToCreate: CreateTodo = {
      ...todoData,
      title: todoData.title.trim(),
      priority: todoData.priority ?? 1,
      done: todoData.done ?? false,
    };

    return await this.todoRepository.create(todoToCreate);
  }

  async updateTodo(id: number, todoData: UpdateTodo): Promise<Todo> {
    // Validate if todo exists
    await this.getTodoById(id);

    // Validate title if provided
    if (todoData.title !== undefined) {
      if (!todoData.title || todoData.title.trim() === '') {
        throw new ValidationError('Title cannot be empty');
      }
      todoData.title = todoData.title.trim();
    }

    // Validate priority if provided
    if (todoData.priority !== undefined && (todoData.priority < 1 || todoData.priority > 10)) {
      throw new ValidationError('Priority must be between 1 and 10');
    }

    const updatedTodo = await this.todoRepository.update(id, todoData);
    if (!updatedTodo) {
      throw new TodoNotFoundError(id);
    }

    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    const deleted = await this.todoRepository.delete(id);
    if (!deleted) {
      throw new TodoNotFoundError(id);
    }
  }

  async markAsComplete(id: number): Promise<Todo> {
    return await this.updateTodo(id, { done: true });
  }

  async markAsIncomplete(id: number): Promise<Todo> {
    return await this.updateTodo(id, { done: false });
  }

  async getTodosByPriority(priority: number): Promise<Todo[]> {
    // Validate priority range
    if (priority < 1 || priority > 10) {
      throw new ValidationError('Priority must be between 1 and 10');
    }

    return await this.todoRepository.findByPriority(priority);
  }

  async getPendingTodos(): Promise<Todo[]> {
    return await this.todoRepository.findByStatus(false);
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return await this.todoRepository.findByStatus(true);
  }
}