import type { ContractManagerMCP } from '../index.js';
import { taskService, contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { z } from 'zod';
import {
  contractCodeSchema,
  taskCodeSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  taskListOutputSchema,
  taskOutputSchema,
} from '../schemas/schema.js';
import { createText, createTaskResourceLink, createTaskEmbeddedResource } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export function registerTaskTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_tasks',
    {
      title: 'List Tasks',
      description: 'List all tasks in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      outputSchema: taskListOutputSchema,
    },
    async () => {
      const tasks = await taskService.getAll();
      const taskLinks = tasks.map(createTaskResourceLink);
      const structuredContent = {
        tasks,
        count: tasks.length,
      };
      return {
        content: [
          createText(`Found ${tasks.length} tasks.`),
          ...taskLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'get_task',
    {
      title: 'Get Task',
      description: 'Get a task by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: taskCodeSchema,
      outputSchema: { task: z.object(taskOutputSchema) },
    },
    async ({ code }) => {
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      const structuredContent = { task };
      return {
        content: [createTaskEmbeddedResource(task), createText(structuredContent)],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'create_task',
    {
      title: 'Create Task',
      description: 'Create a new task',
      annotations: {
        destructiveHint: false,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: createTaskInputSchema,
      outputSchema: { task: z.object(taskOutputSchema) },
    },
    async taskData => {
      const createdTask = await taskService.createWithCode(taskData);
      const structuredContent = { task: createdTask };
      return {
        content: [
          createText(
            `Task "${createdTask.name}" created successfully with code "${createdTask.code}"`
          ),
          createTaskEmbeddedResource(createdTask),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'update_task',
    {
      title: 'Update Task',
      description: 'Update a task. Fields that are not provided will not be updated.',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: updateTaskInputSchema,
      outputSchema: { task: z.object(taskOutputSchema) },
    },
    async ({ code, ...updates }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      const updatedTask = await taskService.updateByCode(code, updates);
      const structuredContent = { task: updatedTask };
      return {
        content: [
          createText(`Task "${updatedTask.name}" (code: ${code}) updated successfully`),
          createTaskEmbeddedResource(updatedTask),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'delete_task',
    {
      title: 'Delete Task',
      description: 'Delete a task',
      annotations: {
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: taskCodeSchema,
      outputSchema: { task: z.object(taskOutputSchema) },
    },
    async ({ code }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      await taskService.deleteByCode(code);
      const structuredContent = { task: existingTask };
      return {
        content: [
          createText(`Task "${existingTask.name}" (code: ${code}) deleted successfully`),
          createTaskEmbeddedResource(existingTask),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'get_tasks_by_contract',
    {
      title: 'Get Tasks by Contract',
      description: 'Get all tasks for a specific contract',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: contractCodeSchema,
      outputSchema: {
        contract_code: z.string(),
        contract_name: z.string(),
        ...taskListOutputSchema,
      },
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      const tasks = await taskService.getByContractCode(code);
      const taskLinks = tasks.map(createTaskResourceLink);
      const structuredContent = {
        contract_code: code,
        contract_name: contract.name,
        tasks,
        count: tasks.length,
      };
      return {
        content: [
          createText(`Found ${tasks.length} tasks for contract "${contract.name}" (${code}).`),
          ...taskLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );
}
