import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, updateTaskSchema, 
  insertSubtaskSchema, updateSubtaskSchema,
  insertHabitSchema, updateHabitSchema,
  insertHabitEntrySchema, updateHabitEntrySchema,
  insertTimeTrackingSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create task
  app.post("/api/tasks", async (req, res) => {
    try {
      console.log("Received task data:", JSON.stringify(req.body, null, 2));
      const taskData = insertTaskSchema.parse(req.body);
      console.log("Parsed task data:", JSON.stringify(taskData, null, 2));
      const task = await storage.createTask(taskData);
      console.log("Created task:", JSON.stringify(task, null, 2));
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Server error:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(id, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Reorder tasks
  app.post("/api/tasks/reorder", async (req, res) => {
    try {
      const { taskIds } = req.body;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ message: "taskIds must be an array" });
      }
      await storage.reorderTasks(taskIds);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder tasks" });
    }
  });

  // Get motivational quote from ZenQuotes API
  app.get("/api/quote", async (req, res) => {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      const data = await response.json();
      
      if (data && data[0]) {
        res.json({
          text: data[0].q,
          author: data[0].a
        });
      } else {
        // Fallback quote
        res.json({
          text: "The secret of getting ahead is getting started. Every small step counts! 🌟",
          author: "Mark Twain"
        });
      }
    } catch (error) {
      // Fallback quote on error
      res.json({
        text: "You are capable of amazing things! Keep pushing forward! 💪",
        author: "TaskFlow"
      });
    }
  });

  // ===== SUBTASKS ROUTES =====
  
  // Get subtasks for a task
  app.get("/api/tasks/:taskId/subtasks", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const subtasks = await storage.getSubtasks(taskId);
      res.json(subtasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subtasks" });
    }
  });

  // Create subtask
  app.post("/api/tasks/:taskId/subtasks", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const subtaskData = insertSubtaskSchema.parse({ ...req.body, taskId });
      const subtask = await storage.createSubtask(subtaskData);
      res.status(201).json(subtask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subtask data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subtask" });
    }
  });

  // Update subtask
  app.patch("/api/subtasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateSubtaskSchema.parse(req.body);
      const subtask = await storage.updateSubtask(id, updates);
      if (!subtask) {
        return res.status(404).json({ message: "Subtask not found" });
      }
      res.json(subtask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update subtask" });
    }
  });

  // Delete subtask
  app.delete("/api/subtasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSubtask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Subtask not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subtask" });
    }
  });

  // ===== HABITS ROUTES =====
  
  // Get all habits
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits();
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  // Get single habit
  app.get("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const habit = await storage.getHabit(id);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit" });
    }
  });

  // Create habit
  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(habitData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  // Update habit
  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateHabitSchema.parse(req.body);
      const habit = await storage.updateHabit(id, updates);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  // Delete habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteHabit(id);
      if (!deleted) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // ===== HABIT ENTRIES ROUTES =====
  
  // Get habit entries
  app.get("/api/habits/:habitId/entries", async (req, res) => {
    try {
      const habitId = parseInt(req.params.habitId);
      const date = req.query.date as string;
      const entries = await storage.getHabitEntries(habitId, date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit entries" });
    }
  });

  // Create habit entry
  app.post("/api/habits/entries", async (req, res) => {
    try {
      const entryData = insertHabitEntrySchema.parse(req.body);
      const entry = await storage.createHabitEntry(entryData);
      
      // Award points for habit completion
      if (entry.completed) {
        await storage.addPoints(5); // 5 points per habit completion
        await storage.updateStreak(true);
      }
      
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create habit entry" });
    }
  });

  // Update habit entry
  app.patch("/api/habits/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateHabitEntrySchema.parse(req.body);
      const entry = await storage.updateHabitEntry(id, updates);
      if (!entry) {
        return res.status(404).json({ message: "Habit entry not found" });
      }
      
      // Update points and streak based on completion
      if (updates.completed !== undefined) {
        if (updates.completed) {
          await storage.addPoints(5);
          await storage.updateStreak(true);
        }
      }
      
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update habit entry" });
    }
  });

  // ===== GAMIFICATION & STATS ROUTES =====
  
  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Update user stats
  app.patch("/api/stats", async (req, res) => {
    try {
      const updates = req.body;
      const stats = await storage.updateUserStats(updates);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  // Add points
  app.post("/api/stats/points", async (req, res) => {
    try {
      const { points } = req.body;
      if (typeof points !== 'number') {
        return res.status(400).json({ message: "Points must be a number" });
      }
      const stats = await storage.addPoints(points);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to add points" });
    }
  });

  // ===== TASK NOTES ROUTES =====
  
  // Get task notes
  app.get("/api/tasks/:taskId/notes", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const notes = await storage.getTaskNotes(taskId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task notes" });
    }
  });

  // Create task note
  app.post("/api/tasks/:taskId/notes", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const { content } = req.body;
      if (!content?.trim()) {
        return res.status(400).json({ message: "Note content is required" });
      }
      const note = await storage.createTaskNote(taskId, content);
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task note" });
    }
  });

  // Delete task note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTaskNote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // ===== TIME TRACKING ROUTES =====
  
  // Get time tracking sessions for a task
  app.get("/api/tasks/:taskId/time-sessions", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const sessions = await storage.getTimeTrackingSessions(taskId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time tracking sessions" });
    }
  });

  // Start time tracking
  app.post("/api/tasks/:taskId/time-tracking/start", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const { description } = req.body;
      const session = await storage.startTimeTracking(taskId, description);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start time tracking" });
    }
  });

  // Stop time tracking
  app.patch("/api/time-sessions/:sessionId/stop", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.stopTimeTracking(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Time tracking session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop time tracking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
