"use client";

import { use, useState, useRef } from 'react';
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
import { useTask } from "@/lib/task-context";
import { ArrowLeft, Upload, Paperclip, X } from "lucide-react";
import Link from "next/link";

export default function UpdateTask({ params }: { params: Promise<{ id: string }> }) {
  const { loading, getTask, updateTask } = useTask();
  const { id } = use(params); 
  const task = getTask(id)!;

  if (loading) {
    return;
  }

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<string>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);
  const [attachment, setAttachments] = useState("");
  const [attachments, updateAttachments] = useState<string[]>(task.attachments);

  const doUploadFileRef = useRef<HTMLInputElement>(null);

  const doUploadFile = () => {
    doUploadFileRef.current!.click();
  };

  const doDragandDropFile = (e: any) => {
    e.preventDefault();
    const filename = e.dataTransfer.files.item(0).name;
    updateAttachments((existingAttachments) => [...existingAttachments].includes(filename) ? [...existingAttachments]:[...existingAttachments, filename]);
  }

  const doSetAttachment = (filepath: string) => {
    setAttachments(filepath);
    updateAttachments((existingAttachments) => [...existingAttachments, filepath.replace("C:\\fakepath\\", "")]);
  };

  const doRemoveAttachment = (file: string) => {
    updateAttachments((existingAttachments) => existingAttachments.filter((attachment: string) => attachment !== file));
  };

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
            <p className="text-sm font-bold">Edit Task</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="mx-auto w-150">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Edit Task</CardTitle>
              <CardDescription>
                Edit the information below to update the task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="font-medium mb-2">Task Title *</p>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title"></Input>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Description *</p>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task in detail"></Input>
              </div>
              <div className="mb-4 grid gap-x-4 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <p className="font-medium mb-2">Priority</p>
                  <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    {task.priority}
                  </Select>
                </div>
                <div>
                  <p className="font-medium mb-2">Due Date *</p>
                  <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="Date"></Input>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Assigned To *</p>
                <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Enter assignee name"></Input>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Attachments</p>
                <Card>
                  <CardContent className="items-center text-center">
                    <div className="drag-drop" onDrop={(e) => doDragandDropFile(e)} onDragOver={(e) => e.preventDefault()}>
                      <div className="flex justify-center items-center text-center">
                        <Upload className="h-10 w-10 text-muted-foreground"/>
                      </div>
                      <p className="font-medium text-muted-foreground my-2">Drag and drop files here, or click to browse</p>
                      <Button variant="outline" size="sm" asChild onClick={doUploadFile}>
                        <Link href="">Choose Files</Link>
                      </Button>
                      <Input className="hidden" type="file" ref={doUploadFileRef} value={attachment} onChange={(e) => doSetAttachment(e.target.value)}></Input>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {attachments.length > 0 ? (
                <div className="mb-4">
                  <p className="font-medium mb-2">Uploaded Files</p>
                  <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-2">
                    {attachments.slice().map((file) => (
                      <Button className="px-3" key={file} variant="outline" size="lg" asChild onClick={() => doRemoveAttachment(file)}>
                        <div>
                          <div className="flex flex-1 items-center justify-left">
                            <Paperclip className="mr-2 h-4 w-4"/>
                            {file}
                          </div>
                          <div className="flex items-center justify-right">
                            <X className="h-4 w-4"/>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (<div></div>)}
              <div className="flex">
                <Button className="flex flex-auto mr-2" size="sm" asChild onClick={
                  () => {updateTask(id, {
                    title: title,
                    description: description,
                    status: "draft" as "draft" | "pending" | "approved" | "rejected" | "completed",
                    priority: priority as "low" | "medium" | "high",
                    dueDate: dueDate,
                    assignedTo: assignedTo,
                    createdBy: task.createdBy as string,
                    attachments: attachments
                  })}
                }>
                  <Link href=".">Update Task</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href=".">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}