import type { ContractManagerMCP } from '../index.js';
import { taskService, contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import {
  contractCodeSchema,
  taskCodeSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
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
    },
    async () => {
      const tasks = await taskService.getAll();
      const taskLinks = tasks.map(createTaskResourceLink);
      return {
        content: [createText(`Found ${tasks.length} tasks.`), ...taskLinks],
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
    },
    async ({ code }) => {
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      return {
        content: [createTaskEmbeddedResource(task)],
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
    },
    async taskData => {
      const createdTask = await taskService.createWithCode(taskData);
      return {
        content: [
          createText(
            `Task "${createdTask.name}" created successfully with code "${createdTask.code}"`
          ),
          createTaskEmbeddedResource(createdTask),
        ],
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
    },
    async ({ code, ...updates }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      const updatedTask = await taskService.updateByCode(code, updates);
      return {
        content: [
          createText(`Task "${updatedTask.name}" (code: ${code}) updated successfully`),
          createTaskEmbeddedResource(updatedTask),
        ],
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
    },
    async ({ code }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      await taskService.deleteByCode(code);
      return {
        content: [
          createText(`Task "${existingTask.name}" (code: ${code}) deleted successfully`),
          createTaskEmbeddedResource(existingTask),
        ],
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
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      const tasks = await taskService.getByContractCode(code);
      const taskLinks = tasks.map(createTaskResourceLink);
      return {
        content: [
          createText(`Found ${tasks.length} tasks for contract "${contract.name}" (${code}).`),
          ...taskLinks,
        ],
      };
    }
  );
}
