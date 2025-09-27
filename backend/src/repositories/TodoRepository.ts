import { Knex } from 'knex';
import { Todo, CreateTodo, UpdateTodo } from '../models/Todo';
import { TodoNotFoundError, DatabaseError } from '../types/errors';

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: number): Promise<Todo | null>;
  create(todoData: CreateTodo): Promise<Todo>;
  update(id: number, todoData: UpdateTodo): Promise<Todo | null>;
  delete(id: number): Promise<boolean>;
  findByPriority(priority: number): Promise<Todo[]>;
  findByStatus(done: boolean): Promise<Todo[]>;
}

export class TodoRepository implements ITodoRepository {
  constructor(private db: Knex) {}

  async findAll(): Promise<Todo[]> {
    try {
      return await this.db('todos').select('*').orderBy('created_at', 'desc');
    } catch (error) {
      throw new DatabaseError('Failed to fetch todos', error as Error);
    }
  }

  async findById(id: number): Promise<Todo | null> {
    try {
      const todo = await this.db('todos').where({ id }).first();
      return todo || null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch todo with id ${id}`, error as Error);
    }
  }

  async create(todoData: CreateTodo): Promise<Todo> {
    try {
      const [todo] = await this.db('todos')
        .insert(todoData)
        .returning('*');
      return todo;
    } catch (error) {
      throw new DatabaseError('Failed to create todo', error as Error);
    }
  }

  async update(id: number, todoData: UpdateTodo): Promise<Todo | null> {
    try {
      const [todo] = await this.db('todos')
        .where({ id })
        .update({ ...todoData, updated_at: new Date() })
        .returning('*');
      return todo || null;
    } catch (error) {
      throw new DatabaseError(`Failed to update todo with id ${id}`, error as Error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await this.db('todos').where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to delete todo with id ${id}`, error as Error);
    }
  }

  async findByPriority(priority: number): Promise<Todo[]> {
    try {
      return await this.db('todos')
        .where({ priority })
        .orderBy('created_at', 'desc');
    } catch (error) {
      throw new DatabaseError(`Failed to fetch todos with priority ${priority}`, error as Error);
    }
  }

  async findByStatus(done: boolean): Promise<Todo[]> {
    try {
      return await this.db('todos')
        .where({ done })
        .orderBy('created_at', 'desc');
    } catch (error) {
      throw new DatabaseError(`Failed to fetch todos with status ${done}`, error as Error);
    }
  }
}