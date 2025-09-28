import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').trim(),
    body: z.string().max(1000, 'Body must be less than 1000 characters').optional(),
    priority: z.number().int().min(1, 'Priority must be at least 1').max(10, 'Priority must be at most 10').default(1),
    deadline: z.string().datetime('Invalid datetime format').optional(),
    done: z.boolean().default(false)
  })
});

export const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(255, 'Title must be less than 255 characters').trim().optional(),
    body: z.string().max(1000, 'Body must be less than 1000 characters').optional(),
    priority: z.number().int().min(1, 'Priority must be at least 1').max(10, 'Priority must be at most 10').optional(),
    deadline: z.string().datetime('Invalid datetime format').optional(),
    done: z.boolean().optional()
  })
});

export const todoParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number)
  })
});

export const priorityParamsSchema = z.object({
  params: z.object({
    priority: z.string().regex(/^\d+$/, 'Priority must be a valid number').transform(Number)
  })
});

export const queryPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    sort: z.enum(['created_at', 'updated_at', 'priority', 'title']).optional().default('created_at'),
    order: z.enum(['asc', 'desc']).optional().default('desc')
  }).optional().default(() => ({ page: 1, limit: 10, sort: 'created_at' as const, order: 'desc' as const }))
});