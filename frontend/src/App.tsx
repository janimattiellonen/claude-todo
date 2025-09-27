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
