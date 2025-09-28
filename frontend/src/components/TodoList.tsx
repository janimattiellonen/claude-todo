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
