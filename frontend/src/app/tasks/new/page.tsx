"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Task, useTask } from "@/lib/task-context";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

class task implements Task {
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

  constructor() {
    this.id = "";
    this.title = document.getElementById("title").innerText;
    this.description = document.getElementById("description").innerText;
    this.status = "draft";
    this.priority = document.getElementById("priority").innerText;
    this.dueDate = document.getElementById("dueDate").innerText;
    this.createdAt = "";
    this.assignedTo = document.getElementById("assignedTo").innerText;
    this.createdBy = "";
    this.attachments = [document.getElementById("attachments").innerText];
    this.comments = document.getElementById("dueDate").innerText;
  }
}

export default function NewTask() {
  const { createTask } = useTask();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-left">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              My Tasks
            </Link>
          </Button>
          <div>
            <p className="text-sm font-bold">Create New Task</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="mx-auto w-150">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Task Details</CardTitle>
              <CardDescription>
                Fill in the information below to create a new task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="font-medium mb-2">Task Title *</p>
                <Input id="title" placeholder="Enter task title"></Input>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Description *</p>
                <Input id="description" placeholder="Describe the task in detail"></Input>
              </div>
              <div className="mb-4 grid gap-x-4 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <p className="font-medium mb-2">Priority</p>
                  <Select id="priority">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>
                <div>
                  <p className="font-medium mb-2">Due Date *</p>
                  <Input id="dueDate" type="Date"></Input>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Assigned To *</p>
                <Input id="assignedTo" placeholder="Enter assignee name"></Input>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Attachments</p>
                <Card>
                  <CardContent className="items-center text-center">
                    <div className="flex justify-center items-center text-center">
                      <Upload className="h-10 w-10 text-muted-foreground"/>
                    </div>
                    <p className="font-medium text-muted-foreground my-2">Drag and drop files here, or click to browse</p>
                    <Input id="attachments" type="file"></Input>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Button className="px-50 mr-2" size="sm" asChild onClick={
                  () => {createTask(new task())}
                }>
                  <Link href="..">Create Task</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/tasks">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}