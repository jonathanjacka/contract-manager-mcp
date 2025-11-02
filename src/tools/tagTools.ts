import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { tagService, taskService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { z } from 'zod';
import {
  tagCodeSchema,
  createTagInputSchema,
  updateTagInputSchema,
  tagTaskSchema,
  tagListOutputSchema,
  tagOutputSchema,
  taskOutputSchema,
} from '../schemas/schema.js';
import {
  createText,
  createTagResourceLink,
  createTagEmbeddedResource,
  createTaskEmbeddedResource,
} from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export async function registerTagTools(agent: ContractManagerMCP) {
  const initialTags = await tagService.getAll();
  let hasTags = initialTags.length > 0;

  async function updateTagToolsAvailability() {
    const tags = await tagService.getAll();
    const newHasTags = tags.length > 0;

    if (newHasTags === hasTags) {
      return;
    }

    hasTags = newHasTags;

    if (hasTags) {
      listTagsTool.enable();
      getTagTool.enable();
      editTagTool.enable();
      deleteTagTool.enable();
      addTagToTaskTool.enable();
      removeTagFromTaskTool.enable();
    } else {
      listTagsTool.disable();
      getTagTool.disable();
      editTagTool.disable();
      deleteTagTool.disable();
      addTagToTaskTool.disable();
      removeTagFromTaskTool.disable();
    }
    // createTagTool always enabled
  }

  const listTagsTool = agent.server.registerTool(
    'list_tags',
    {
      title: 'List Tags',
      description: 'List all tags in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      outputSchema: tagListOutputSchema,
    },
    async () => {
      const tags = await tagService.getAll();
      const tagLinks = tags.map(createTagResourceLink);
      const structuredContent = {
        tags,
        count: tags.length,
      };
      return {
        content: [
          createText(`Found ${tags.length} tags.`),
          ...tagLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const getTagTool = agent.server.registerTool(
    'get_tag',
    {
      title: 'Get Tag',
      description: 'Get a tag by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagCodeSchema,
      outputSchema: { tag: z.object(tagOutputSchema) },
    },
    async ({ code }) => {
      const tag = await tagService.getByCode(code);
      assert(tag, `Tag with code "${code}" not found`);
      const structuredContent = { tag };
      return {
        content: [createTagEmbeddedResource(tag), createText(structuredContent)],
        structuredContent,
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
      outputSchema: { tag: z.object(tagOutputSchema) },
    },
    async tagData => {
      const createdTag = await tagService.createWithCode(tagData);

      await updateTagToolsAvailability();
      agent.resourceNotifiers?.notifyTagResourceChanged();

      const structuredContent = { tag: createdTag };
      return {
        content: [
          createText(
            `Tag "${createdTag.name}" created successfully with code "${createdTag.code}"`
          ),
          createTagEmbeddedResource(createdTag),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const editTagTool = agent.server.registerTool(
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
      outputSchema: { tag: z.object(tagOutputSchema) },
    },
    async ({ code, ...updates }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);
      const updatedTag = await tagService.updateByCode(code, updates);
      agent.resourceNotifiers?.notifyTagResourceChanged();
      const structuredContent = { tag: updatedTag };
      return {
        content: [
          createText(`Tag "${updatedTag.name}" (code: ${code}) updated successfully`),
          createTagEmbeddedResource(updatedTag),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const deleteTagTool = agent.server.registerTool(
    'delete_tag',
    {
      title: 'Delete Tag',
      description: 'Delete a tag',
      annotations: {
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: tagCodeSchema,
      outputSchema: { tag: z.object(tagOutputSchema) },
    },
    async ({ code }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);

      // Elicitation: ask for confirmation before deleting
      const capabilities = agent.server.server.getClientCapabilities?.();
      if (capabilities?.elicitation) {
        const result = await agent.server.server.elicitInput({
          message: `Are you sure you want to delete tag "${existingTag.name}" (code: ${code})?`,
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
          const structuredContent = { tag: existingTag };
          return {
            content: [
              createText(
                `Deleting tag "${existingTag.name}" (code: ${code}) was cancelled by the user.`
              ),
              createTagEmbeddedResource(existingTag),
              createText(JSON.stringify(structuredContent, null, 2)),
            ],
            structuredContent,
          };
        }
      }

      await tagService.deleteByCode(code);

      await updateTagToolsAvailability();
      agent.resourceNotifiers?.notifyTagResourceChanged();

      const structuredContent = { tag: existingTag };
      return {
        content: [
          createText(`Tag "${existingTag.name}" (code: ${code}) deleted successfully`),
          createTagEmbeddedResource(existingTag),
          createText(JSON.stringify(structuredContent, null, 2)),
        ],
        structuredContent,
      };
    }
  );

  const addTagToTaskTool = agent.server.registerTool(
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
      outputSchema: {
        tag: z.object(tagOutputSchema),
        task: z.object(taskOutputSchema),
      },
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.addToTask(tag_code, task_code);

      const structuredContent = { tag, task };
      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) applied to task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const removeTagFromTaskTool = agent.server.registerTool(
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
      outputSchema: {
        tag: z.object(tagOutputSchema),
        task: z.object(taskOutputSchema),
      },
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.removeFromTask(tag_code, task_code);

      const structuredContent = { tag, task };
      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) removed from task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  // Set initial tool states based on database state (without triggering notifications)
  if (!hasTags) {
    listTagsTool.disable();
    getTagTool.disable();
    editTagTool.disable();
    deleteTagTool.disable();
    addTagToTaskTool.disable();
    removeTagFromTaskTool.disable();
  }
}
