import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <Suspense fallback={<div>Loading...</div>}>
        <main className="p-4">{children}</main>
      </Suspense>
    </SidebarProvider>
  );
}
