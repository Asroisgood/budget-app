"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[140px]" />
        <div className="absolute left-0 top-1/3 h-40 w-40 rounded-full bg-sky-400/20 blur-[90px]" />
      </div>

      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Bar with Sidebar Trigger */}
          <div className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur">
            <div className="flex items-center p-4">
              <SidebarTrigger className="text-slate-200 hover:text-white hover:bg-white/10" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-32 text-white">
                  Loading...
                </div>
              }
            >
              <main className="p-4 sm:p-6">{children}</main>
            </Suspense>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
