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
