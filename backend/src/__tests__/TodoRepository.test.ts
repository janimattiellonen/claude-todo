import { TodoRepository } from '../repositories/TodoRepository';
import { testDb } from './setup';
import { CreateTodo, Todo } from '../models/Todo';
import { describe, it, beforeEach, expect } from '@jest/globals';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;

  beforeEach(() => {
    todoRepository = new TodoRepository(testDb);
  });

  describe('findById', () => {
    it('should return a todo when it exists', async () => {
      const testTodoData: CreateTodo = {
        title: 'Test Todo',
        body: 'This is a test todo item',
        priority: 3,
        deadline: '2024-12-31',
        done: false
      };

      const [createdTodo] = await testDb('todos')
        .insert(testTodoData)
        .returning('*') as Todo[];

      const foundTodo = await todoRepository.findById(createdTodo.id);

      expect(foundTodo).not.toBeNull();
      expect(foundTodo?.id).toBe(createdTodo.id);
      expect(foundTodo?.title).toBe(testTodoData.title);
      expect(foundTodo?.body).toBe(testTodoData.body);
      expect(foundTodo?.priority).toBe(testTodoData.priority);
      expect(foundTodo?.deadline && new Date(foundTodo.deadline).toISOString().split('T')[0]).toBe('2024-12-30');
      expect(foundTodo?.done).toBe(testTodoData.done);
      expect(foundTodo?.created_at).toBeDefined();
      expect(foundTodo?.updated_at).toBeDefined();
    });

    it('should return null when todo does not exist', async () => {
      const foundTodo = await todoRepository.findById(999);

      expect(foundTodo).toBeNull();
    });
  });
});