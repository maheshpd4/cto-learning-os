"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  Bot,
  Code2,
  Library,
  FolderKanban,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard, description: "Today's overview" },
  { href: "/roadmap",    label: "Roadmap",      icon: Map,             description: "6-phase journey" },
  { href: "/checkin",    label: "Daily Check-in", icon: CheckSquare,  description: "End-of-day review" },
  { href: "/coach",      label: "AI Coach",     icon: Bot,             description: "Gemini-powered coaching" },
  { href: "/practice",   label: "Practice",     icon: Code2,           description: "Coding challenges" },
  { href: "/materials",  label: "Materials",    icon: Library,         description: "Learning resources" },
  { href: "/projects",   label: "Projects",     icon: FolderKanban,    description: "Portfolio tracker" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col bg-card border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo / Brand */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-border",
        collapsed && "justify-center"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">CTO Learning OS</p>
            <p className="text-xs text-muted-foreground mt-0.5">Nov 4, 2026 Goal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate">{item.label}</p>
                </div>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className={cn(
        "p-3 border-t border-border flex items-center",
        collapsed ? "justify-center flex-col gap-2" : "justify-between"
      )}>
        <ThemeToggle />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
