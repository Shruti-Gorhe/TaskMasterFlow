# TaskFlow - Gamified Task Management & Habit Tracking Application

## Overview

TaskFlow is a comprehensive, gamified task management and habit tracking application built with React, TypeScript, Express.js, and PostgreSQL. The application transforms productivity into an engaging experience with advanced features including:

**🎮 Gamification System**: XP points, levels, streaks, badges, and celebration animations
**📋 Advanced Task Management**: Subtasks, notes, attachments, time tracking, recurring tasks, and dependencies  
**🎯 Habit Tracking**: Daily habit monitoring with progress visualization and streak tracking
**🌸 Beautiful UI**: Clean pastel theme with tabbed navigation, confetti animations, and motivational elements
**📊 Analytics Dashboard**: Progress tracking, weekly overviews, and performance analytics

## System Architecture

The application follows a clean monorepo structure with clear separation between frontend, backend, and shared code:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Development**: Hot module replacement via Vite integration

## Key Components

### Frontend Architecture
- **Component-based React application** using functional components and hooks
- **shadcn/ui design system** providing consistent, accessible UI components
- **Tailwind CSS** for utility-first styling with custom color palette
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management and caching
- **Theme support** with light/dark mode toggle capability

### Backend Architecture
- **Express.js REST API** with TypeScript for type safety
- **Modular route handling** with centralized error handling
- **Storage abstraction layer** supporting both in-memory and database implementations
- **Middleware integration** for request logging and JSON parsing
- **Development/production environment** handling with Vite integration

### Database Schema
The application uses a single `tasks` table with the following structure:
- `id`: Auto-incrementing primary key
- `title`: Task title (required)
- `description`: Optional task description
- `category`: Task category (Personal, Work, Fitness, Home)
- `priority`: Task priority (Low, Medium, High)
- `dueDate`: Optional due date
- `completed`: Boolean completion status
- `order`: Integer for task ordering
- `createdAt`: Timestamp for creation date

## Data Flow

1. **Client requests** are handled by React components using custom hooks
2. **TanStack Query** manages API calls with automatic caching and background updates
3. **Express.js routes** process requests and interact with the storage layer
4. **Storage layer** abstracts database operations (currently memory-based, designed for PostgreSQL)
5. **Responses** are automatically cached and synchronized across components

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for component-based UI
- **Express.js** for server-side API handling
- **Drizzle ORM** for type-safe database operations
- **Neon Database** serverless PostgreSQL adapter

### UI and Styling
- **shadcn/ui components** based on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety across the stack
- **Zod** for runtime type validation and schema definitions

## Deployment Strategy

### Development Environment
- **Vite dev server** with hot module replacement
- **Express.js** running in development mode with request logging
- **TypeScript** compilation with incremental builds
- **Environment variable** support for database configuration

### Production Build Process
1. **Frontend build**: Vite compiles React app to static assets
2. **Backend build**: ESBuild bundles Express server for Node.js
3. **Database migrations**: Drizzle handles schema changes
4. **Static serving**: Express serves built frontend assets

### Database Setup
- **PostgreSQL** database required (configured via DATABASE_URL)
- **Drizzle migrations** in `/migrations` directory
- **Schema definition** in `/shared/schema.ts` for type safety

## Changelog

```
Changelog:
- July 02, 2025. Initial setup with React, Express, PostgreSQL
- July 02, 2025. Fixed critical integer overflow bug in task creation (order field)
- July 02, 2025. Added PostgreSQL database integration with Drizzle ORM
- July 02, 2025. Added Thought of the Day feature with inspirational quotes
- July 02, 2025. Updated background to pastel pink flowers with beautiful SVG patterns
- July 02, 2025. Enhanced form validation and error handling
- July 02, 2025. MAJOR UPDATE: Implemented comprehensive gamification system with XP, levels, streaks, and badges
- July 02, 2025. MAJOR UPDATE: Added full habit tracking system with daily/weekly progress monitoring
- July 02, 2025. MAJOR UPDATE: Added confetti celebration animations for task completions
- July 02, 2025. MAJOR UPDATE: Expanded database schema to support subtasks, notes, attachments, and time tracking
- July 02, 2025. Updated UI to clean pastel theme with tabbed navigation (Tasks, Habits, Progress, Analytics)
- July 02, 2025. Added comprehensive API routes for all gamification and habit tracking features
```

## User Preferences

Preferred communication style: Simple, everyday language.