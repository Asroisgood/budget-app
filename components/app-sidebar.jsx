"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, List, ArrowLeftRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: List,
  },
  {
    title: "Transaction",
    url: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    isLogout: true,
  },
];

const AppSidebar = memo(function AppSidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Handle unauthorized or error
          console.error("Failed to fetch user data:", res.status);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      }
    };

    getUserData();
  }, []);

  return (
    <Sidebar className="border-r border-white/10 bg-slate-900/95 sm:bg-slate-900/80 backdrop-blur">
      <SidebarContent>
        {/* Logo/Brand Section */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded bg-emerald-500"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-200 truncate">
                Budget
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personal Finance
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Group */}
        <div className="p-3 sm:p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 text-xs font-medium px-2 mb-2">
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-200 focus:bg-emerald-500/10 focus:text-emerald-200 transition-all duration-200 h-10 sm:h-12 rounded-lg ${
                        item.isLogout
                          ? "hover:bg-red-500/10 hover:text-red-200 focus:bg-red-500/10 focus:text-red-200"
                          : ""
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="text-sm sm:text-base truncate">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="border-t border-white/10 p-3 sm:p-4">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-800/50">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-800/50">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-700 animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-700 rounded animate-pulse mb-1"></div>
              <div className="h-2 sm:h-3 w-24 sm:w-32 bg-slate-700 rounded animate-pulse hidden sm:block"></div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
});

export { AppSidebar };
