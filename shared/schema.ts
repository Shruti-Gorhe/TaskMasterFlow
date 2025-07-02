import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const TaskCategory = z.enum(["Personal", "Work", "Fitness", "Home"]);
export const TaskPriority = z.enum(["Low", "Medium", "High"]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Personal"),
  priority: text("priority").notNull().default("Medium"),
  dueDate: text("due_date"),
  completed: boolean("completed").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  category: TaskCategory.default("Personal"),
  priority: TaskPriority.default("Medium"),
});

export const updateTaskSchema = insertTaskSchema.partial();

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type TaskCategoryType = z.infer<typeof TaskCategory>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
