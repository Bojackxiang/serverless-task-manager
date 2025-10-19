import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TaskProvider } from "@/lib/task-context";

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <TaskProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarProvider>
    </TaskProvider>
  );
};

export default DashboardLayout;
