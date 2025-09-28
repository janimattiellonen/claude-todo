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
