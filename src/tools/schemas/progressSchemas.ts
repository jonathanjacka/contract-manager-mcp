import { z } from 'zod';

export const runLongTaskInputSchema = {
  duration: z
    .number()
    .min(1)
    .max(300)
    .default(30)
    .describe('Duration of the task in seconds (1-300, default: 30)'),
  steps: z
    .number()
    .min(1)
    .max(100)
    .default(10)
    .describe('Number of progress steps to report (1-100, default: 10)'),
  taskName: z.string().optional().describe('Optional name for the task (for progress messages)'),
};

export const runLongTaskOutputSchema = {
  success: z.boolean(),
  duration: z.number(),
  steps: z.number(),
  completedAt: z.string(),
  cancelled: z.boolean().optional(),
};
