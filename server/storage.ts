import { 
  tasks, subtasks, habits, habitEntries, userStats, taskNotes, taskAttachments, timeTrackingSessions,
  type Task, type InsertTask, type UpdateTask,
  type Subtask, type InsertSubtask, type UpdateSubtask,
  type Habit, type InsertHabit, type UpdateHabit,
  type HabitEntry, type InsertHabitEntry, type UpdateHabitEntry,
  type UserStats, type TaskNote, type TaskAttachment, type TimeTrackingSession
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  reorderTasks(taskIds: number[]): Promise<void>;
  
  // Subtasks
  getSubtasks(taskId: number): Promise<Subtask[]>;
  createSubtask(subtask: InsertSubtask): Promise<Subtask>;
  updateSubtask(id: number, updates: UpdateSubtask): Promise<Subtask | undefined>;
  deleteSubtask(id: number): Promise<boolean>;
  
  // Habits
  getHabits(): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, updates: UpdateHabit): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  
  // Habit Entries
  getHabitEntries(habitId: number, date?: string): Promise<HabitEntry[]>;
  getHabitEntry(habitId: number, date: string): Promise<HabitEntry | undefined>;
  createHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  updateHabitEntry(id: number, updates: UpdateHabitEntry): Promise<HabitEntry | undefined>;
  
  // User Stats & Gamification
  getUserStats(): Promise<UserStats>;
  updateUserStats(updates: Partial<UserStats>): Promise<UserStats>;
  addPoints(points: number): Promise<UserStats>;
  updateStreak(completed: boolean): Promise<UserStats>;
  
  // Task Notes
  getTaskNotes(taskId: number): Promise<TaskNote[]>;
  createTaskNote(taskId: number, content: string): Promise<TaskNote>;
  deleteTaskNote(id: number): Promise<boolean>;
  
  // Time Tracking
  getTimeTrackingSessions(taskId: number): Promise<TimeTrackingSession[]>;
  startTimeTracking(taskId: number, description?: string): Promise<TimeTrackingSession>;
  stopTimeTracking(sessionId: number): Promise<TimeTrackingSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(): Promise<Task[]> {
    const result = await db.select().from(tasks).orderBy(tasks.order);
    return result;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return task;
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task | undefined> {
    const updateData = { ...updates };
    if (updates.completed === true && !updates.completedAt) {
      updateData.completedAt = new Date().toISOString();
    }
    
    const [task] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      // Delete related subtasks, notes, attachments, and time sessions first
      await db.delete(subtasks).where(eq(subtasks.taskId, id));
      await db.delete(taskNotes).where(eq(taskNotes.taskId, id));
      await db.delete(taskAttachments).where(eq(taskAttachments.taskId, id));
      await db.delete(timeTrackingSessions).where(eq(timeTrackingSessions.taskId, id));
      await db.delete(tasks).where(eq(tasks.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async reorderTasks(taskIds: number[]): Promise<void> {
    for (let i = 0; i < taskIds.length; i++) {
      await db
        .update(tasks)
        .set({ order: i })
        .where(eq(tasks.id, taskIds[i]));
    }
  }

  // Subtasks
  async getSubtasks(taskId: number): Promise<Subtask[]> {
    return await db.select().from(subtasks).where(eq(subtasks.taskId, taskId)).orderBy(subtasks.order);
  }

  async createSubtask(insertSubtask: InsertSubtask): Promise<Subtask> {
    const [subtask] = await db.insert(subtasks).values(insertSubtask).returning();
    return subtask;
  }

  async updateSubtask(id: number, updates: UpdateSubtask): Promise<Subtask | undefined> {
    const [subtask] = await db.update(subtasks).set(updates).where(eq(subtasks.id, id)).returning();
    return subtask || undefined;
  }

  async deleteSubtask(id: number): Promise<boolean> {
    try {
      await db.delete(subtasks).where(eq(subtasks.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.isActive, true));
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit || undefined;
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db.insert(habits).values(insertHabit).returning();
    return habit;
  }

  async updateHabit(id: number, updates: UpdateHabit): Promise<Habit | undefined> {
    const [habit] = await db.update(habits).set(updates).where(eq(habits.id, id)).returning();
    return habit || undefined;
  }

  async deleteHabit(id: number): Promise<boolean> {
    try {
      await db.delete(habitEntries).where(eq(habitEntries.habitId, id));
      await db.delete(habits).where(eq(habits.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Habit Entries
  async getHabitEntries(habitId: number, date?: string): Promise<HabitEntry[]> {
    if (date) {
      return await db.select().from(habitEntries)
        .where(and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, date)))
        .orderBy(desc(habitEntries.date));
    } else {
      return await db.select().from(habitEntries)
        .where(eq(habitEntries.habitId, habitId))
        .orderBy(desc(habitEntries.date));
    }
  }

  async getHabitEntry(habitId: number, date: string): Promise<HabitEntry | undefined> {
    const [entry] = await db.select().from(habitEntries)
      .where(and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, date)));
    return entry || undefined;
  }

  async createHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const [entry] = await db.insert(habitEntries).values(insertEntry).returning();
    return entry;
  }

  async updateHabitEntry(id: number, updates: UpdateHabitEntry): Promise<HabitEntry | undefined> {
    const [entry] = await db.update(habitEntries).set(updates).where(eq(habitEntries.id, id)).returning();
    return entry || undefined;
  }

  // User Stats & Gamification
  async getUserStats(): Promise<UserStats> {
    const [stats] = await db.select().from(userStats).limit(1);
    if (!stats) {
      // Create initial stats if none exist
      const [newStats] = await db.insert(userStats).values({}).returning();
      return newStats;
    }
    return stats;
  }

  async updateUserStats(updates: Partial<UserStats>): Promise<UserStats> {
    const currentStats = await this.getUserStats();
    const [updatedStats] = await db.update(userStats)
      .set(updates)
      .where(eq(userStats.id, currentStats.id))
      .returning();
    return updatedStats;
  }

  async addPoints(points: number): Promise<UserStats> {
    const currentStats = await this.getUserStats();
    const newTotalPoints = (currentStats.totalPoints || 0) + points;
    const newLevel = Math.floor(newTotalPoints / 100) + 1; // Level up every 100 points
    
    return await this.updateUserStats({
      totalPoints: newTotalPoints,
      level: newLevel,
    });
  }

  async updateStreak(completed: boolean): Promise<UserStats> {
    const currentStats = await this.getUserStats();
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = currentStats.lastActivityDate;
    
    let newStreak = currentStats.currentStreak || 0;
    
    if (completed) {
      if (lastActivity === today) {
        // Already completed today, no change to streak
        return currentStats;
      } else if (lastActivity === this.getYesterday()) {
        // Continuing streak
        newStreak += 1;
      } else {
        // Starting new streak
        newStreak = 1;
      }
    } else {
      // Streak broken
      newStreak = 0;
    }
    
    const longestStreak = Math.max(currentStats.longestStreak || 0, newStreak);
    
    return await this.updateUserStats({
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
    });
  }

  private getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Task Notes
  async getTaskNotes(taskId: number): Promise<TaskNote[]> {
    return await db.select().from(taskNotes)
      .where(eq(taskNotes.taskId, taskId))
      .orderBy(desc(taskNotes.createdAt));
  }

  async createTaskNote(taskId: number, content: string): Promise<TaskNote> {
    const [note] = await db.insert(taskNotes).values({ taskId, content }).returning();
    return note;
  }

  async deleteTaskNote(id: number): Promise<boolean> {
    try {
      await db.delete(taskNotes).where(eq(taskNotes.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Time Tracking
  async getTimeTrackingSessions(taskId: number): Promise<TimeTrackingSession[]> {
    return await db.select().from(timeTrackingSessions)
      .where(eq(timeTrackingSessions.taskId, taskId))
      .orderBy(desc(timeTrackingSessions.createdAt));
  }

  async startTimeTracking(taskId: number, description?: string): Promise<TimeTrackingSession> {
    const [session] = await db.insert(timeTrackingSessions).values({
      taskId,
      startTime: new Date(),
      description: description || null,
    }).returning();
    return session;
  }

  async stopTimeTracking(sessionId: number): Promise<TimeTrackingSession | undefined> {
    const endTime = new Date();
    const [session] = await db.select().from(timeTrackingSessions)
      .where(eq(timeTrackingSessions.id, sessionId));
    
    if (!session || session.endTime) {
      return undefined; // Session not found or already stopped
    }
    
    const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / (1000 * 60)); // in minutes
    
    const [updatedSession] = await db.update(timeTrackingSessions)
      .set({ endTime, duration })
      .where(eq(timeTrackingSessions.id, sessionId))
      .returning();
    
    // Update task's total time spent
    await db.update(tasks)
      .set({ 
        timeSpent: (await this.getTask(session.taskId))?.timeSpent || 0 + duration 
      })
      .where(eq(tasks.id, session.taskId));
    
    return updatedSession;
  }
}

export const storage = new DatabaseStorage();
