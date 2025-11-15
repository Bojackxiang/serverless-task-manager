"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTask } from "@/lib/task-context";
import { CheckSquare, Clock, FileText, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
//import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const { tasks} = useTask();
  const { logout } = useAuth();
  const { user, shouldBlock } = useAuthGuard();

  if (shouldBlock) {
    return null;
  }

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    approved: tasks.filter((t) => t.status === "approved").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    draft: tasks.filter((t) => t.status === "draft").length,
  };

  const recentTasks = tasks.slice(0, 5);

  return (
      <div className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1"/>

          <div className="flex flex-1 items-center justify-between">
            {/* 左侧：标题 */}
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name}! Here&rsquo;s your task overview.
              </p>
            </div>

            {/* 右侧：按钮组 */}
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/tasks/new">
                  <Plus className="mr-2 h-4 w-4"/>
                  New Task
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.total}</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approval
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  Task completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Your latest task activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{task.title}</h3>
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
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tasks/${task.id}`}>View</Link>
                      </Button>
                    </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/tasks">View All Tasks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
}

// function DashboardSkeleton() {
//   return (
//       <div className="flex flex-col h-screen">
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//           <SidebarTrigger className="-ml-1"/>
//           <div className="flex flex-1 items-center justify-between">
//             <div>
//               <Skeleton className="h-6 w-32 mb-2"/>
//               <Skeleton className="h-4 w-64"/>
//             </div>
//             <Skeleton className="h-10 w-24"/>
//           </div>
//         </header>
//
//         <main className="flex-1 overflow-auto p-4 space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             {Array.from({length: 4}).map((_, i) => (
//                 <Card key={i}>
//                   <CardHeader className="space-y-0 pb-2">
//                 <Skeleton className="h-4 w-24" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-8 w-16 mb-2" />
//                 <Skeleton className="h-3 w-20" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-6 w-32 mb-2" />
//             <Skeleton className="h-4 w-48" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <div key={i} className="p-4 border rounded-lg">
//                   <Skeleton className="h-5 w-48 mb-2" />
//                   <Skeleton className="h-4 w-full mb-1" />
//                   <Skeleton className="h-3 w-24" />
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
