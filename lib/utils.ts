import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
}

export function daysUntil(date: Date | string): number {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function pctComplete(start: Date | string, end: Date | string): number {
  const now = new Date().getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

export const SKILL_LABELS: Record<string, string> = {
  AI_SYSTEMS: "AI Systems",
  DATA_PLATFORMS: "Data Platforms",
  CLOUD_ARCHITECTURE: "Cloud Architecture",
  ENTERPRISE_INTEGRATION: "Enterprise Integration",
  PLATFORM_ENGINEERING: "Platform Engineering",
  SECURITY: "Security",
  PRODUCT_FINANCE_LEADERSHIP: "Product & Leadership",
};

export const SKILL_COLORS: Record<string, string> = {
  AI_SYSTEMS: "#8b5cf6",
  DATA_PLATFORMS: "#06b6d4",
  CLOUD_ARCHITECTURE: "#0ea5e9",
  ENTERPRISE_INTEGRATION: "#f59e0b",
  PLATFORM_ENGINEERING: "#10b981",
  SECURITY: "#ef4444",
  PRODUCT_FINANCE_LEADERSHIP: "#ec4899",
};

export const SKILL_BG_CLASSES: Record<string, string> = {
  AI_SYSTEMS: "skill-ai",
  DATA_PLATFORMS: "skill-data",
  CLOUD_ARCHITECTURE: "skill-cloud",
  ENTERPRISE_INTEGRATION: "skill-integration",
  PLATFORM_ENGINEERING: "skill-platform",
  SECURITY: "skill-security",
  PRODUCT_FINANCE_LEADERSHIP: "skill-leadership",
};
