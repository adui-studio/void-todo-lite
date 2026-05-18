// routes/api/todos.ts
import { defineHandler } from 'void';
import { db, desc } from 'void/db';
import { todos } from '@schema';

export const GET = defineHandler(async () => {
  const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));

  return Response.json({
    todos: allTodos,
  });
});