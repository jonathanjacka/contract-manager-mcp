import type { ContractManagerMCP } from '../index.js';
import { tagService, taskService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import {
  tagCodeSchema,
  createTagInputSchema,
  updateTagInputSchema,
  tagTaskSchema,
} from '../schemas/schema.js';
import {
  createText,
  createTagResourceLink,
  createTagEmbeddedResource,
  createTaskEmbeddedResource,
} from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export function registerTagTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_tags',
    {
      title: 'List Tags',
      description: 'List all tags in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
    },
    async () => {
      const tags = await tagService.getAll();
      const tagLinks = tags.map(createTagResourceLink);
      return {
        content: [createText(`Found ${tags.length} tags.`), ...tagLinks],
      };
    }
  );

  agent.server.registerTool(
    'get_tag',
    {
      title: 'Get Tag',
      description: 'Get a tag by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagCodeSchema,
    },
    async ({ code }) => {
      const tag = await tagService.getByCode(code);
      assert(tag, `Tag with code "${code}" not found`);
      return {
        content: [createTagEmbeddedResource(tag)],
      };
    }
  );

  agent.server.registerTool(
    'create_tag',
    {
      title: 'Create Tag',
      description: 'Create a new tag with a unique name',
      annotations: {
        destructiveHint: false,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: createTagInputSchema,
    },
    async tagData => {
      const createdTag = await tagService.createWithCode(tagData);
      return {
        content: [
          createText(
            `Tag "${createdTag.name}" created successfully with code "${createdTag.code}"`
          ),
          createTagEmbeddedResource(createdTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'edit_tag',
    {
      title: 'Edit Tag',
      description: 'Update a tag. The new name must be unique.',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: updateTagInputSchema,
    },
    async ({ code, ...updates }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);
      const updatedTag = await tagService.updateByCode(code, updates);
      return {
        content: [
          createText(`Tag "${updatedTag.name}" (code: ${code}) updated successfully`),
          createTagEmbeddedResource(updatedTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'delete_tag',
    {
      title: 'Delete Tag',
      description: 'Delete a tag',
      annotations: {
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagCodeSchema,
    },
    async ({ code }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);
      await tagService.deleteByCode(code);
      return {
        content: [
          createText(`Tag "${existingTag.name}" (code: ${code}) deleted successfully`),
          createTagEmbeddedResource(existingTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'add_tag_to_task',
    {
      title: 'Add Tag to Task',
      description: 'Apply a tag to a task',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagTaskSchema,
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.addToTask(tag_code, task_code);

      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) applied to task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );

  agent.server.registerTool(
    'remove_tag_from_task',
    {
      title: 'Remove Tag from Task',
      description: 'Remove a tag from a task',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagTaskSchema,
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.removeFromTask(tag_code, task_code);

      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) removed from task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );
}
