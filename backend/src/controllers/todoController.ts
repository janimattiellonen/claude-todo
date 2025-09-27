import { Request, Response } from 'express';
import db from '../database';
import { Todo, CreateTodo, UpdateTodo } from '../models/Todo';

export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todos = await db('todos').select('*').orderBy('created_at', 'desc');
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await db('todos').where({ id }).first();

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      body,
      priority = 1,
      deadline,
      done = false,
    }: CreateTodo = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    if (priority < 1 || priority > 10) {
      res.status(400).json({ error: 'Priority must be between 1 and 10' });
      return;
    }

    const [todo] = await db('todos')
      .insert({ title, body, priority, deadline, done })
      .returning('*');

    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, body, priority, deadline, done }: UpdateTodo = req.body;

    if (priority && (priority < 1 || priority > 10)) {
      res.status(400).json({ error: 'Priority must be between 1 and 10' });
      return;
    }

    const [todo] = await db('todos')
      .where({ id })
      .update({ title, body, priority, deadline, done, updated_at: new Date() })
      .returning('*');

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCount = await db('todos').where({ id }).del();

    if (deletedCount === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
