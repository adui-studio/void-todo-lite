// db/schema.ts
import { sql } from 'void/db';
import { createInsertSchema } from 'void/drizzle-zod';
import { integer, sqliteTable, text } from 'void/schema-d1';
import { z } from 'zod';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  title: text('title').notNull(),

  completed: integer('completed', { mode: 'boolean' })
      .notNull()
      .default(false),

  createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
});

export const insertTodoSchema = createInsertSchema(todos, {
  title: z.string().min(1, 'Todo 内容不能为空'),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;