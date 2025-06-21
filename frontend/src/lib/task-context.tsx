"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "draft" | "pending" | "approved" | "rejected" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
  assignedTo: string;
  createdBy: string;
  attachments: string[];
  comments?: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  approveTask: (id: string, comments?: string) => Promise<void>;
  rejectTask: (id: string, comments?: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design System Documentation",
    description:
      "Create comprehensive documentation for the design system components and guidelines.",
    status: "pending",
    priority: "high",
    dueDate: "2024-01-15",
    createdAt: "2024-01-01",
    assignedTo: "John Doe",
    createdBy: "Jane Smith",
    attachments: ["design-system-v1.pdf", "component-library.sketch"],
  },
  {
    id: "2",
    title: "API Integration Testing",
    description: "Test all API endpoints and ensure proper error handling.",
    status: "approved",
    priority: "medium",
    dueDate: "2024-01-20",
    createdAt: "2024-01-02",
    assignedTo: "Alice Johnson",
    createdBy: "Bob Wilson",
    attachments: ["api-test-results.json"],
  },
  {
    id: "3",
    title: "User Feedback Analysis",
    description:
      "Analyze user feedback from the latest product release and create actionable insights.",
    status: "completed",
    priority: "low",
    dueDate: "2024-01-10",
    createdAt: "2023-12-28",
    assignedTo: "Carol Brown",
    createdBy: "David Lee",
    attachments: [],
  },
  {
    id: "4",
    title: "Security Audit Report",
    description:
      "Conduct comprehensive security audit and prepare detailed report.",
    status: "draft",
    priority: "high",
    dueDate: "2024-01-25",
    createdAt: "2024-01-03",
    assignedTo: "Eve Davis",
    createdBy: "Frank Miller",
    attachments: ["security-checklist.pdf"],
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const createTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTasks((prev) => [newTask, ...prev]);
    toast({
      title: "Task Created",
      description: "Your task has been created successfully.",
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully.",
    });
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully.",
      variant: "destructive",
    });
  };

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const approveTask = async (id: string, comments?: string) => {
    await updateTask(id, { status: "approved", comments });
    toast({
      title: "Task Approved",
      description: "Task has been approved successfully.",
    });
  };

  const rejectTask = async (id: string, comments?: string) => {
    await updateTask(id, { status: "rejected", comments });
    toast({
      title: "Task Rejected",
      description: "Task has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        getTask,
        approveTask,
        rejectTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
