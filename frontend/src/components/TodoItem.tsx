import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Todo, UpdateTodo } from '../types';
import { Calendar, Edit3, Trash2, Save, X, Check } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
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
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Priority {num}</option>
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
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${todo.done ? 'border-green-500 bg-gray-50' : 'border-blue-500'} ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleToggleDone}
              className={`p-1 rounded-full ${todo.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} hover:bg-green-600 transition-colors`}
            >
              <Check className="w-4 h-4" />
            </button>
            <h3 className={`text-lg font-medium ${todo.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
              Priority {todo.priority}
            </span>
          </div>

          {todo.body && (
            <p className={`text-gray-600 mb-3 ${todo.done ? 'line-through' : ''}`}>
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