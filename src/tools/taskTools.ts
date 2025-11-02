import { tagService } from '../services/index.js';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
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
  // Helper function to update tool availability based on data
  async function updateTaskToolsAvailability() {
    const tasks = await taskService.getAll();
    const hasTasks = tasks.length > 0;

    if (hasTasks) {
      suggestTagsForTaskTool.enable();
      listTasksTool.enable();
      getTaskTool.enable();
      updateTaskTool.enable();
      deleteTaskTool.enable();
      getTasksByContractTool.enable();
    } else {
      suggestTagsForTaskTool.disable();
      listTasksTool.disable();
      getTaskTool.disable();
      updateTaskTool.disable();
      deleteTaskTool.disable();
      getTasksByContractTool.disable();
    }
    // createTaskTool is always enabled
  }

  // Suggest tags for a task using sampling
  const suggestTagsForTaskTool = agent.server.registerTool(
    'suggest_tags_for_task',
    {
      title: 'Suggest Tags for Task',
      description: 'Suggest relevant tags for a task using AI sampling',
      annotations: {
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: taskCodeSchema,
      outputSchema: {
        suggestedTags: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string().optional(),
            description: z.string().optional(),
          })
        ),
      },
    },
    async ({ code }) => {
      const clientCapabilities = agent.server.server.getClientCapabilities?.();
      if (!clientCapabilities?.sampling) {
        return {
          content: [createText('Client does not support sampling, skipping tag suggestion.')],
          structuredContent: { suggestedTags: [] },
        };
      }

      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      const allTags = await tagService.getAll();
      const currentTags = await tagService.getByTaskCode(code);

      // System prompt for the LLM
      const systemPrompt = `You are a helpful assistant that suggests relevant tags for tasks to make them easier to categorize and find later. You will be provided with a task, its current tags, and all existing tags. Only suggest tags that are not already applied to this task. Tasks should not have more than 4-5 tags and it's perfectly fine to not have any tags at all. Feel free to suggest new tags that are not currently in the database and they will be created.\n\nYou will respond with JSON only.\nExample responses:\nIf you have no suggestions, respond with an empty array:\n[]\nIf you have some suggestions, respond with an array of tag objects. Existing tags have an "id" property, new tags have a "name" and "description" property:\n[{"id": "TAG001"}, {"name": "New Tag", "description": "The description of the new tag"}, {"id": "TAG002"}]`;

      const userContent = {
        task,
        currentTags,
        allTags,
      };

      const result = await agent.server.server.createMessage({
        systemPrompt,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              mimeType: 'application/json',
              text: JSON.stringify(userContent),
            },
          },
        ],
        maxTokens: 150,
      });

      // Parse and validate the model response
      let suggestedTags: Array<{ id?: string; name?: string; description?: string }> = [];
      try {
        const text =
          typeof result.content.text === 'string'
            ? result.content.text
            : String(result.content.text);
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          suggestedTags = parsed.map((tag: any) => ({
            id: typeof tag.id === 'string' ? tag.id : undefined,
            name: typeof tag.name === 'string' ? tag.name : undefined,
            description: typeof tag.description === 'string' ? tag.description : undefined,
          }));
        }
      } catch (error) {
        await agent.server.server.sendLoggingMessage?.({
          level: 'error',
          data: {
            message: 'Error parsing tag suggestions',
            modelResponse: result.content.text,
            error: error instanceof Error ? error.message : error,
          },
        });
        const structuredContent = { suggestedTags: [] };
        return {
          content: [
            createText('Error parsing tag suggestions from model output.'),
            createText(JSON.stringify(structuredContent, null, 2)),
          ],
          structuredContent,
        };
      }

      // Create new tags if needed and collect all tag objects to return
      const tagsToReturn: Array<{ id?: string; name?: string; description?: string }> = [];
      for (const tag of suggestedTags) {
        if (tag.id) {
          // Existing tag
          const found = allTags.find(t => t.code === tag.id);
          if (found && !currentTags.some(t => t.code === tag.id)) {
            tagsToReturn.push({ id: found.code, name: found.name });
          }
        } else if (tag.name) {
          // New tag
          const existing = allTags.find(t => t.name.toLowerCase() === tag.name!.toLowerCase());
          if (!existing) {
            // Create the new tag
            try {
              const created = await tagService.createWithCode({ name: tag.name! });
              tagsToReturn.push({ id: created.code, name: created.name });
            } catch (e) {
              // If tag creation fails, skip
              continue;
            }
          } else if (!currentTags.some(t => t.code === existing.code)) {
            tagsToReturn.push({ id: existing.code, name: existing.name });
          }
        }
      }

      return {
        content: [
          createText(`Suggested tags for task "${task.name}" (code: ${code}):`),
          createText(JSON.stringify({ suggestedTags: tagsToReturn }, null, 2)),
        ],
        structuredContent: { suggestedTags: tagsToReturn },
      };
    }
  );
  const listTasksTool = agent.server.registerTool(
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

  const getTaskTool = agent.server.registerTool(
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

      // Update tool availability after creating a task
      await updateTaskToolsAvailability();

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

  const updateTaskTool = agent.server.registerTool(
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

  const deleteTaskTool = agent.server.registerTool(
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

      // Elicitation: ask for confirmation before deleting
      const capabilities = agent.server.server.getClientCapabilities?.();
      if (capabilities?.elicitation) {
        const result = await agent.server.server.elicitInput({
          message: `Are you sure you want to delete task "${existingTask.name}" (code: ${code})?`,
          requestedSchema: {
            type: 'object',
            properties: {
              confirmed: {
                type: 'boolean',
                description: 'Whether to confirm the action',
              },
            },
          },
        });
        const confirmed = result.action === 'accept' && result.content?.['confirmed'] === true;
        if (!confirmed) {
          const structuredContent = { task: existingTask };
          return {
            content: [
              createText(
                `Deleting task \"${existingTask.name}\" (code: ${code}) was cancelled by the user.`
              ),
              createTaskEmbeddedResource(existingTask),
              createText(JSON.stringify(structuredContent, null, 2)),
            ],
            structuredContent,
          };
        }
      }

      await taskService.deleteByCode(code);

      // Update tool availability after deleting a task
      await updateTaskToolsAvailability();

      const structuredContent = { task: existingTask };
      return {
        content: [
          createText(`Task \"${existingTask.name}\" (code: ${code}) deleted successfully`),
          createTaskEmbeddedResource(existingTask),
          createText(JSON.stringify(structuredContent, null, 2)),
        ],
        structuredContent,
      };
    }
  );

  const getTasksByContractTool = agent.server.registerTool(
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

  // Initialize tool availability based on current data
  updateTaskToolsAvailability();
}
