export type Todo = {
  id: number;
  title: string;
  body?: string;
  priority: number;
  deadline?: string;
  done: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTodo = {
  title: string;
  body?: string;
  priority?: number;
  deadline?: string;
  done?: boolean;
};

export type UpdateTodo = {
  title?: string;
  body?: string;
  priority?: number;
  deadline?: string;
  done?: boolean;
};
