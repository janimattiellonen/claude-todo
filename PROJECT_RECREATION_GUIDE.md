# ClaudeTodo Project Recreation Guide

This guide provides step-by-step instructions to recreate the ClaudeTodo full-stack application exactly as implemented.

## Prerequisites

- **Node.js**: v18+ (tested with v22.6.0)
- **npm**: v8+ (tested with v10.8.2)
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: For version control

## Project Structure

Create the following directory structure:

```
claude-todo/
├── .env                    # Root environment variables
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
├── docker-compose.yml      # Docker services configuration
├── backend/                # Express.js API
│   ├── .env                # Backend environment variables
│   ├── .eslintrc.js        # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   ├── Dockerfile          # Backend Docker image
│   ├── knexfile.js         # Knex database configuration
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── src/
│       ├── config/
│       │   └── database.ts # Database connection setup
│       ├── controllers/
│       │   └── todoController.ts # API route handlers
│       ├── migrations/
│       │   └── [timestamp]_create_todos_table.ts # Database schema
│       ├── models/
│       │   └── Todo.ts     # TypeScript interfaces
│       ├── routes/
│       │   └── todoRoutes.ts # API route definitions
│       ├── database.ts     # Database export
│       └── index.ts        # Express app entry point
└── frontend/               # React application
    ├── .eslintrc.js        # ESLint configuration
    ├── .prettierrc         # Prettier configuration
    ├── eslint.config.js    # Additional ESLint config
    ├── index.html          # HTML template
    ├── package.json        # Frontend dependencies
    ├── postcss.config.js   # PostCSS configuration
    ├── tsconfig.json       # TypeScript configuration
    ├── tsconfig.app.json   # App-specific TypeScript config
    ├── tsconfig.node.json  # Node-specific TypeScript config
    ├── vite.config.ts      # Vite configuration
    ├── public/
    │   └── vite.svg        # Vite logo
    └── src/
        ├── assets/
        │   └── react.svg   # React logo
        ├── components/
        │   ├── TodoForm.tsx # Add/edit todo form
        │   ├── TodoItem.tsx # Individual todo display
        │   └── TodoList.tsx # Todo list with filtering
        ├── hooks/
        │   └── useTodos.ts # Custom React hook for todo operations
        ├── services/
        │   └── api.ts      # API client functions
        ├── types/
        │   └── index.ts    # TypeScript type definitions
        ├── App.css         # Global styles (minimal)
        ├── App.tsx         # Main application component
        ├── index.css       # Tailwind CSS imports
        └── main.tsx        # React application entry point
```

## Step 1: Initialize Project Structure

```bash
# Create project directory
mkdir claude-todo
cd claude-todo

# Create subdirectories
mkdir -p backend/src/{config,controllers,migrations,models,routes}
mkdir -p frontend/src/{components,hooks,services,types,assets}
mkdir -p frontend/public

# Initialize git repository
git init
git checkout -b project-bootstrap
```

## Step 2: Root Configuration Files

### .env
```env
POSTGRES_PORT=5434
BACKEND_PORT=8999
```

### .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
frontend/dist/
backend/dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3
postgres_data/

# Logs
logs/
*.log
lerna-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore

# Vite
.vite

# Local development
.local
```

### docker-compose.yml
```yaml
services:
  postgres:
    image: postgres:15
    container_name: claude-todo-postgres
    environment:
      POSTGRES_DB: claude_todo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - claude-todo-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: claude-todo-backend
    environment:
      NODE_ENV: development
      PORT: ${BACKEND_PORT:-8999}
      DATABASE_URL: postgres://postgres:password@postgres:5432/claude_todo
    ports:
      - "${BACKEND_PORT:-8999}:${BACKEND_PORT:-8999}"
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - claude-todo-network

volumes:
  postgres_data:

networks:
  claude-todo-network:
    driver: bridge
```

## Step 3: Backend Setup

### Navigate to backend directory
```bash
cd backend
```

### Initialize npm and install dependencies
```bash
npm init -y

# Production dependencies
npm install express cors helmet morgan dotenv pg knex

# Development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/morgan ts-node nodemon eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### backend/package.json
```json
{
  "name": "claude-todo-backend",
  "version": "1.0.0",
  "description": "Backend API for ClaudeTodo app",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "migrate:make": "knex migrate:make",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": ["todo", "api", "express", "typescript"],
  "author": "",
  "license": "ISC"
}
```

### backend/.env
```env
NODE_ENV=development
PORT=8999
DATABASE_URL=postgres://postgres:password@localhost:5434/claude_todo
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=claude_todo
```

### backend/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### backend/.eslintrc.js
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
```

### backend/.prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### backend/knexfile.js
```javascript
require('ts-node/register');
require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'claude_todo'
    },
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/migrations'
    }
  }
};
```

### backend/Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8999

CMD ["npm", "start"]
```

## Step 4: Backend Source Code

### backend/src/config/database.ts
```typescript
import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'claude_todo',
    },
    migrations: {
      directory: './migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
  },
};

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

export default db;
```

### backend/src/database.ts
```typescript
export { default } from './config/database';
```

### backend/src/models/Todo.ts
```typescript
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
```

### Create database migration
```bash
npx knex migrate:make create_todos_table
```

### backend/src/migrations/[timestamp]_create_todos_table.ts
```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('body');
    table.integer('priority').notNullable().defaultTo(1).checkBetween([1, 10]);
    table.date('deadline');
    table.boolean('done').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('todos');
}
```

### backend/src/controllers/todoController.ts
```typescript
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
```

### backend/src/routes/todoRoutes.ts
```typescript
import { Router } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

const router = Router();

router.get('/todos', getAllTodos);
router.get('/todos/:id', getTodoById);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

export default router;
```

### backend/src/index.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8999;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/api', todoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
```

## Step 5: Frontend Setup

### Navigate to frontend directory
```bash
cd ../frontend
```

### Initialize Vite React TypeScript project
```bash
npm create vite@latest . -- --template react-ts
```

### Install additional dependencies
```bash
# Install dependencies
npm install

# Install additional packages
npm install react-hook-form lucide-react

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/node @tailwindcss/postcss prettier
```

### frontend/package.json (add format script)
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write src/**/*.{ts,tsx}"
  }
}
```

### frontend/vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5222,
  },
})
```

### frontend/.eslintrc.js
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### frontend/.prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### frontend/postcss.config.js
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### frontend/src/index.css
```css
@import "tailwindcss";
```

## Step 6: Frontend Source Code

### frontend/src/types/index.ts
```typescript
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
```

### frontend/src/services/api.ts
```typescript
import type { Todo, CreateTodo, UpdateTodo } from '../types';

const API_BASE_URL = 'http://localhost:8999/api';

export const api = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  async createTodo(todo: CreateTodo): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  async updateTodo(id: number, todo: UpdateTodo): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};
```

### frontend/src/hooks/useTodos.ts
```typescript
import { useState, useEffect } from 'react';
import type { Todo, CreateTodo, UpdateTodo } from '../types';
import { api } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: CreateTodo) => {
    try {
      const newTodo = await api.createTodo(todoData);
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: number, todoData: UpdateTodo) => {
    try {
      const updatedTodo = await api.updateTodo(id, todoData);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
};
```

## Step 7: React Components

### frontend/src/components/TodoForm.tsx
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import type { CreateTodo } from '../types';
import { Plus, Calendar } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (data: CreateTodo) => Promise<void>;
  loading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodo>({
    defaultValues: {
      priority: 1,
      done: false,
    },
  });

  const handleFormSubmit = async (data: CreateTodo) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Failed to submit todo:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          id="title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter todo title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          {...register('body')}
          id="body"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter todo description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority (1-10)
          </label>
          <select
            {...register('priority', {
              valueAsNumber: true,
              min: { value: 1, message: 'Priority must be at least 1' },
              max: { value: 10, message: 'Priority must be at most 10' },
            })}
            id="priority"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priority.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline
          </label>
          <div className="relative">
            <input
              {...register('deadline')}
              type="date"
              id="deadline"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('done')}
          type="checkbox"
          id="done"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="done" className="ml-2 block text-sm text-gray-700">
          Mark as completed
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};
```

### frontend/src/components/TodoItem.tsx
```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Todo, UpdateTodo } from '../types';
import { Calendar, Edit3, Trash2, Save, X, Check } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTodo>({
    defaultValues: {
      title: todo.title,
      body: todo.body || '',
      priority: todo.priority,
      deadline: todo.deadline || '',
      done: todo.done,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      title: todo.title,
      body: todo.body || '',
      priority: todo.priority,
      deadline: todo.deadline || '',
      done: todo.done,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleUpdate = async (data: UpdateTodo) => {
    try {
      setLoading(true);
      await onUpdate(todo.id, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        setLoading(true);
        await onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
        setLoading(false);
      }
    }
  };

  const handleToggleDone = async () => {
    try {
      await onUpdate(todo.id, { done: !todo.done });
    } catch (error) {
      console.error('Failed to toggle todo status:', error);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <div>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Todo title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register('body')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Todo description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                {...register('priority', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Priority {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                {...register('deadline')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register('done')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${todo.done ? 'border-green-500 bg-gray-50' : 'border-blue-500'} ${loading ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleToggleDone}
              className={`p-1 rounded-full ${todo.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} hover:bg-green-600 transition-colors`}
            >
              <Check className="w-4 h-4" />
            </button>
            <h3
              className={`text-lg font-medium ${todo.done ? 'line-through text-gray-500' : 'text-gray-900'}`}
            >
              {todo.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}
            >
              Priority {todo.priority}
            </span>
          </div>

          {todo.body && (
            <p
              className={`text-gray-600 mb-3 ${todo.done ? 'line-through' : ''}`}
            >
              {todo.body}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {todo.deadline && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Due: {formatDate(todo.deadline)}</span>
              </div>
            )}
            <span>Created: {formatDate(todo.created_at)}</span>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleEdit}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### frontend/src/components/TodoList.tsx
```typescript
import React, { useState } from 'react';
import type { Todo, UpdateTodo } from '../types';
import { TodoItem } from './TodoItem';
import { Filter, Search } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onUpdate: (id: number, data: UpdateTodo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

type FilterType = 'all' | 'pending' | 'completed';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onUpdate,
  onDelete,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !todo.done) ||
      (filter === 'completed' && todo.done);

    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.body && todo.body.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const pendingCount = todos.filter((todo) => !todo.done).length;
  const completedCount = todos.filter((todo) => todo.done).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading todos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All ({todos.length})</option>
                <option value="pending">Pending ({pendingCount})</option>
                <option value="completed">Completed ({completedCount})</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'No todos match your search' : 'No todos found'}
          </div>
          <p className="text-gray-400">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Add your first todo to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### frontend/src/App.tsx
```typescript
import React from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { CheckSquare } from 'lucide-react';

function App() {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">ClaudeTodo</h1>
          </div>
          <p className="text-gray-600">A simple and elegant todo application</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <TodoForm onSubmit={createTodo} loading={loading} />
          </div>
          <div>
            <TodoList
              todos={todos}
              loading={loading}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
```

## Step 8: Deployment and Testing

### Start the application
```bash
# Terminal 1: Start database
docker-compose up postgres -d

# Terminal 2: Start backend
cd backend
npm run migrate
npm run dev

# Terminal 3: Start frontend
cd frontend
npm run dev
```

### Test the application
- Frontend: http://localhost:5222
- Backend API: http://localhost:8999
- Health check: http://localhost:8999/health

### Format code
```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

## Step 9: Git Setup

```bash
# From project root
git add .
git commit -m "Initial project setup: ClaudeTodo full-stack application

- Set up project structure with separate frontend and backend directories
- Configured backend with Express.js, TypeScript, PostgreSQL, and Knex ORM
- Implemented REST API with full CRUD operations for todos
- Created database migration for todos table (title, body, priority, deadline, done)
- Set up frontend with Vite, React, TypeScript, and Tailwind CSS v4
- Implemented todo management UI with forms, lists, and filtering
- Added Docker Compose configuration for PostgreSQL database
- Configured ESLint and Prettier for both frontend and backend
- Created comprehensive project documentation in README.md
- Added .gitignore to exclude sensitive files and build artifacts

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Key Implementation Details

### Database Configuration
- **PostgreSQL port**: 5434 (configurable via POSTGRES_PORT)
- **Credentials**: postgres/password
- **Database**: claude_todo
- **Migration system**: Knex.js with TypeScript

### API Specifications
- **Base URL**: http://localhost:8999/api
- **Endpoints**: GET/POST/PUT/DELETE /todos, GET /todos/:id
- **Authentication**: None (development setup)
- **CORS**: Enabled for frontend communication

### Frontend Configuration
- **Development port**: 5222
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **State management**: React hooks (useState, useEffect)
- **Form handling**: React Hook Form with validation
- **Icons**: Lucide React

### Development Tools
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both frontend and backend
- **Prettier**: Consistent code formatting
- **Nodemon**: Backend hot reload
- **Vite HMR**: Frontend hot module replacement

This guide provides everything needed to recreate the ClaudeTodo project with identical functionality, configuration, and structure.