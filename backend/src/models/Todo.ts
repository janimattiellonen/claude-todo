export interface Todo {
  id: number;
  title: string;
  body?: string;
  priority: number;
  deadline?: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodo {
  title: string;
  body?: string;
  priority?: number;
  deadline?: string;
  done?: boolean;
}

export interface UpdateTodo {
  title?: string;
  body?: string;
  priority?: number;
  deadline?: string;
  done?: boolean;
}