// pages/index.server.ts
import { defineHandler, type InferProps } from 'void';
import { db, desc, eq } from 'void/db';
import { z } from 'zod';
import { todos, insertTodoSchema } from '@schema';

const toggleTodoSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
});

const deleteTodoSchema = z.object({
  id: z.number(),
});

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async () => {
  const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));

  return {
    todos: allTodos,
  };
});

export const actions = {
  create: defineHandler.withValidator({
    body: insertTodoSchema.pick({
      title: true,
    }),
  })(async (_c, { body }) => {
    await db.insert(todos).values({
      title: body.title,
    });
  }),

  toggle: defineHandler.withValidator({
    body: toggleTodoSchema,
  })(async (_c, { body }) => {
    await db
        .update(todos)
        .set({
          completed: !body.completed,
        })
        .where(eq(todos.id, body.id));
  }),

  delete: defineHandler.withValidator({
    body: deleteTodoSchema,
  })(async (_c, { body }) => {
    await db.delete(todos).where(eq(todos.id, body.id));
  }),
};