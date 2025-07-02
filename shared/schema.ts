import { pgTable, serial, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const TaskCategory = z.enum(["Personal", "Work", "Fitness", "Home"]);
export const TaskPriority = z.enum(["Low", "Medium", "High"]);
export const RecurrenceType = z.enum(["none", "daily", "weekly", "monthly", "custom"]);
export const HabitType = z.enum(["workout", "water", "reading", "meditation", "custom"]);

// Main tasks table
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
  // New fields for advanced features
  parentTaskId: integer("parent_task_id"),
  recurrenceType: text("recurrence_type").default("none"),
  recurrenceInterval: integer("recurrence_interval").default(1),
  recurrenceEndDate: text("recurrence_end_date"),
  timeSpent: integer("time_spent").default(0), // in minutes
  isRecurring: boolean("is_recurring").default(false),
  dependsOnTaskId: integer("depends_on_task_id"),
  completedAt: text("completed_at"),
});

// Subtasks table
export const subtasks = pgTable("subtasks", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Task attachments table
export const taskAttachments = pgTable("task_attachments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Task notes/comments table
export const taskNotes = pgTable("task_notes", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Habits table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  habitType: text("habit_type").notNull(),
  targetValue: integer("target_value").default(1), // e.g., 8 glasses of water
  unit: text("unit").default("times"), // e.g., "glasses", "minutes", "times"
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Habit tracking table
export const habitEntries = pgTable("habit_entries", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  value: integer("value").default(0), // actual value achieved
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User stats and gamification
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: text("last_activity_date"),
  tasksCompleted: integer("tasks_completed").default(0),
  habitsCompleted: integer("habits_completed").default(0),
  level: integer("level").default(1),
  badges: jsonb("badges").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Time tracking sessions
export const timeTrackingSessions = pgTable("time_tracking_sessions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").default(0), // in minutes
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const tasksRelations = relations(tasks, ({ many, one }) => ({
  subtasks: many(subtasks),
  attachments: many(taskAttachments),
  notes: many(taskNotes),
  timeSessions: many(timeTrackingSessions),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
  }),
  dependsOnTask: one(tasks, {
    fields: [tasks.dependsOnTaskId],
    references: [tasks.id],
  }),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const taskAttachmentsRelations = relations(taskAttachments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAttachments.taskId],
    references: [tasks.id],
  }),
}));

export const taskNotesRelations = relations(taskNotes, ({ one }) => ({
  task: one(tasks, {
    fields: [taskNotes.taskId],
    references: [tasks.id],
  }),
}));

export const habitsRelations = relations(habits, ({ many }) => ({
  entries: many(habitEntries),
}));

export const habitEntriesRelations = relations(habitEntries, ({ one }) => ({
  habit: one(habits, {
    fields: [habitEntries.habitId],
    references: [habits.id],
  }),
}));

export const timeTrackingSessionsRelations = relations(timeTrackingSessions, ({ one }) => ({
  task: one(tasks, {
    fields: [timeTrackingSessions.taskId],
    references: [tasks.id],
  }),
}));

// Schemas
export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional().transform(val => val === "" ? null : val),
  category: TaskCategory.default("Personal"),
  priority: TaskPriority.default("Medium"),
  dueDate: z.string().nullable().optional().transform(val => val === "" ? null : val),
  completed: z.boolean().default(false),
  order: z.number().default(0),
  parentTaskId: z.number().optional(),
  recurrenceType: RecurrenceType.default("none"),
  recurrenceInterval: z.number().default(1),
  recurrenceEndDate: z.string().optional(),
  isRecurring: z.boolean().default(false),
  dependsOnTaskId: z.number().optional(),
  completedAt: z.string().optional(),
});

export const insertSubtaskSchema = z.object({
  taskId: z.number(),
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
  order: z.number(),
});

export const insertHabitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  habitType: HabitType,
  targetValue: z.number().default(1),
  unit: z.string().default("times"),
  isActive: z.boolean().default(true),
});

export const insertHabitEntrySchema = z.object({
  habitId: z.number(),
  date: z.string(),
  value: z.number().default(0),
  completed: z.boolean().default(false),
});

export const insertTimeTrackingSchema = z.object({
  taskId: z.number(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.number().default(0),
  description: z.string().optional(),
});

export const updateTaskSchema = insertTaskSchema.partial();
export const updateSubtaskSchema = insertSubtaskSchema.partial();
export const updateHabitSchema = insertHabitSchema.partial();
export const updateHabitEntrySchema = insertHabitEntrySchema.partial();

// Types
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertSubtask = z.infer<typeof insertSubtaskSchema>;
export type UpdateSubtask = z.infer<typeof updateSubtaskSchema>;
export type Subtask = typeof subtasks.$inferSelect;

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type UpdateHabit = z.infer<typeof updateHabitSchema>;
export type Habit = typeof habits.$inferSelect;

export type InsertHabitEntry = z.infer<typeof insertHabitEntrySchema>;
export type UpdateHabitEntry = z.infer<typeof updateHabitEntrySchema>;
export type HabitEntry = typeof habitEntries.$inferSelect;

export type TaskAttachment = typeof taskAttachments.$inferSelect;
export type TaskNote = typeof taskNotes.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type TimeTrackingSession = typeof timeTrackingSessions.$inferSelect;

export type TaskCategoryType = z.infer<typeof TaskCategory>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
export type RecurrenceTypeType = z.infer<typeof RecurrenceType>;
export type HabitTypeType = z.infer<typeof HabitType>;