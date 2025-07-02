"use client";

import { use } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTask } from "@/lib/task-context";
import { ArrowLeft, Edit, Trash2, Calendar, User, Paperclip, Download } from "lucide-react";
import Link from "next/link";

export default function ViewTask({ params }: { params: Promise<{ id: string }> }) {
  const { loading, getTask, deleteTask } = useTask();
  const { id } = use(params); 
  const task = getTask(id)!;

  if (loading) {
    return;
  }

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
        </div>
        <div className="flex items-center justify-right">
          <Button variant="outline" size="sm" asChild>
            <Link href="/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-right">
          <Button variant="outline" size="sm" asChild onClick={() => {deleteTask(id)}}>
            <Link href="..">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="mx-auto w-200 space-y-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex text-2xl font-bold gap-2 mb-1">{task.title}
                  <div className="flex items-center">
                    <Badge
                    variant={
                        task.status === "completed"
                        ? "default"
                        : task.status === "approved"
                        ? "secondary"
                        : task.status === "pending"
                        ? "outline"
                        : task.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    >
                    {task.status}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge
                    variant={
                        task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                        ? "outline"
                        : "secondary"
                    }
                    >
                    {task.priority}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 lg:grid-cols-3">
                  <div className="flex items-center justify-left">
                    <div>
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date:</p>
                      <p className="ftext-sm font-bold">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-left">
                    <div>
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To:</p>
                      <p className="text-sm font-bold">{task.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-left">
                    <div>
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created By:</p>
                      <p className="text-sm font-bold">{task.createdBy}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">Created on {task.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex text-2xl font-bold gap-2 mb-1 items-center">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attachments ({task.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-1 lg:grid-cols-1 gap-2">
                {task.attachments.slice().map((file) => (
                  <Button key={file} variant="outline" size="lg" asChild>
                    <div>
                      <div className="flex flex-1 items-center justify-left">
                        <Paperclip className="mr-2 h-4 w-4"/>
                        {file}
                      </div>
                      <div className="flex items-center justify-right">
                        <Download className="h-4 w-4"/>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent>
                <div className="flex">
                  <Button className="className=flex flex-auto mr-2" size="sm" asChild>
                    <Link href="">Submit for Approval</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/edit">Edit Task</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}