import { z } from 'zod';

// Input schemas for MCP tools using Zod
export const employeeCodeSchema = {
  code: z.string().describe('Employee code (e.g., E001)'),
};

export const programCodeSchema = {
  code: z.string().describe('Program code (e.g., P001)'),
};

export const contractCodeSchema = {
  code: z.string().describe('Contract code (e.g., C001)'),
};

export const taskCodeSchema = {
  code: z.string().describe('Task code (e.g., T001)'),
};

export const tagCodeSchema = {
  code: z.string().describe('Tag code (e.g., TAG001)'),
};

// Task CRUD schemas
export const createTaskInputSchema = {
  name: z.string().describe('Task name'),
  completion_value: z.number().min(0).max(10).describe('Task completion value (0-10)'),
  contract_code: z.string().describe('Contract code this task belongs to (e.g., C001)'),
};

export const updateTaskInputSchema = {
  code: z.string().describe('Task code to update (e.g., T001)'),
  name: z.string().optional().describe('New task name'),
  completion_value: z.number().min(0).max(10).optional().describe('New completion value (0-10)'),
};

// Employee CRUD schemas
export const createEmployeeInputSchema = {
  name: z.string().describe('Employee name'),
  job_title: z.string().describe('Employee job title'),
  email: z.string().email().describe('Employee email address'),
};

export const updateEmployeeInputSchema = {
  code: z.string().describe('Employee code to update (e.g., E001)'),
  name: z.string().optional().describe('New employee name'),
  job_title: z.string().optional().describe('New employee job title'),
  email: z.string().email().optional().describe('New employee email address'),
};

export const employeeTaskSchema = {
  employee_code: z.string().describe('Employee code (e.g., E001)'),
  task_code: z.string().describe('Task code (e.g., T001)'),
};

// Tag CRUD schemas
export const createTagInputSchema = {
  name: z.string().describe('Tag name (must be unique)'),
};

export const updateTagInputSchema = {
  code: z.string().describe('Tag code to update (e.g., TAG001)'),
  name: z.string().optional().describe('New tag name (must be unique)'),
};

export const tagTaskSchema = {
  tag_code: z.string().describe('Tag code (e.g., TAG001)'),
  task_code: z.string().describe('Task code (e.g., T001)'),
};
