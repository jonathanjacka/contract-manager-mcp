import { db } from '../database/connection.js';
import { randomUUID } from 'crypto';
import type { Tag, CreateTag } from '../types/database.js';

export const tagService = {
  async getAll(): Promise<Tag[]> {
    return db('tags').select('*').orderBy('name');
  },

  async getById(id: string): Promise<Tag | undefined> {
    return db('tags').where({ id }).first();
  },

  async getByCode(code: string): Promise<Tag | undefined> {
    return db('tags').where({ code }).first();
  },

  async getByName(name: string): Promise<Tag | undefined> {
    return db('tags').where({ name }).first();
  },

  async createWithCode(data: { name: string }): Promise<Tag> {
    // Check if tag name already exists
    const existing = await this.getByName(data.name);
    if (existing) {
      throw new Error(`Tag with name "${data.name}" already exists`);
    }

    // Generate the next tag code manually
    await db('code_counters').where({ entity_type: 'tags' }).increment('current_value', 1);

    const counter = await db('code_counters')
      .where({ entity_type: 'tags' })
      .select('current_value')
      .first();

    const tagCode = `TAG${String(counter.current_value).padStart(3, '0')}`;

    const [tag] = await db('tags')
      .insert({
        id: randomUUID(),
        code: tagCode,
        name: data.name,
      })
      .returning('*');
    return tag;
  },

  async updateByCode(code: string, data: { name?: string | undefined }): Promise<Tag> {
    const tag = await this.getByCode(code);
    if (!tag) throw new Error(`Tag with code ${code} not found`);

    // Check if new name already exists (and it's different from current name)
    if (data.name !== undefined && data.name !== tag.name) {
      const existing = await this.getByName(data.name);
      if (existing) {
        throw new Error(`Tag with name "${data.name}" already exists`);
      }
    }

    // Filter out undefined values
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    updateData.updated_at = new Date();

    const [updatedTag] = await db('tags').where({ code }).update(updateData).returning('*');
    return updatedTag;
  },

  async deleteByCode(code: string): Promise<void> {
    const tag = await this.getByCode(code);
    if (!tag) throw new Error(`Tag with code ${code} not found`);

    // Delete task-tag relationships first
    await db('task_tags').where({ tag_id: tag.id }).del();
    // Delete the tag
    await db('tags').where({ code }).del();
  },

  async addToTask(tagCode: string, taskCode: string): Promise<void> {
    const tag = await this.getByCode(tagCode);
    if (!tag) throw new Error(`Tag with code ${tagCode} not found`);

    const task = await db('tasks').where({ code: taskCode }).first();
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if relationship already exists
    const existing = await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).first();

    if (existing) {
      throw new Error(`Tag ${tagCode} is already applied to task ${taskCode}`);
    }

    await db('task_tags').insert({
      id: randomUUID(),
      tag_id: tag.id,
      task_id: task.id,
    });
  },

  async removeFromTask(tagCode: string, taskCode: string): Promise<void> {
    const tag = await this.getByCode(tagCode);
    if (!tag) throw new Error(`Tag with code ${tagCode} not found`);

    const task = await db('tasks').where({ code: taskCode }).first();
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if relationship exists
    const existing = await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).first();

    if (!existing) {
      throw new Error(`Tag ${tagCode} is not applied to task ${taskCode}`);
    }

    await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).del();
  },

  async getByTaskCode(taskCode: string): Promise<Tag[]> {
    const task = await db('tasks').where({ code: taskCode }).first();
    if (!task) return [];

    return db('tags')
      .join('task_tags', 'tags.id', 'task_tags.tag_id')
      .where('task_tags.task_id', task.id)
      .select('tags.*')
      .orderBy('tags.name');
  },

  async create(data: CreateTag): Promise<Tag> {
    const [tag] = await db('tags').insert(data).returning('*');
    return tag;
  },

  async update(id: string, data: Partial<CreateTag>): Promise<Tag | undefined> {
    const [tag] = await db('tags')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return tag;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('tags').where({ id }).del();
    return deletedCount > 0;
  },
};
