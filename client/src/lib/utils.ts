import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else if (date < today) {
    return "Overdue";
  } else {
    return date.toLocaleDateString();
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "border-red-300 hover:bg-red-50";
    case "Medium":
      return "border-yellow-300 hover:bg-yellow-50";
    case "Low":
      return "border-green-300 hover:bg-green-50";
    default:
      return "border-gray-300 hover:bg-gray-50";
  }
}

export function getPriorityBadgeColor(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "Work":
      return "bg-purple-100 text-purple-700";
    case "Personal":
      return "bg-blue-100 text-blue-700";
    case "Fitness":
      return "bg-green-100 text-green-700";
    case "Home":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getCategoryEmoji(category: string): string {
  switch (category) {
    case "Work":
      return "💼";
    case "Personal":
      return "📚";
    case "Fitness":
      return "💪";
    case "Home":
      return "🏠";
    default:
      return "📝";
  }
}

export function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case "High":
      return "🔴";
    case "Medium":
      return "🟡";
    case "Low":
      return "🟢";
    default:
      return "⚪";
  }
}

export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function loadFromLocalStorage(key: string): any {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
}
