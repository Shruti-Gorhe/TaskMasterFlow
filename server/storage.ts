import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  reorderTasks(taskIds: number[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => a.order - b.order);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description ?? null,
      category: insertTask.category ?? "Personal",
      priority: insertTask.priority ?? "Medium",
      dueDate: insertTask.dueDate ?? null,
      completed: insertTask.completed ?? false,
      order: insertTask.order ?? 0,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async reorderTasks(taskIds: number[]): Promise<void> {
    taskIds.forEach((id, index) => {
      const task = this.tasks.get(id);
      if (task) {
        this.tasks.set(id, { ...task, order: index });
      }
    });
  }
}

export const storage = new MemStorage();
