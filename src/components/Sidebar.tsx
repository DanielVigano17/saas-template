"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar components must be used within a Sidebar");
  }
  return context;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
  children: ReactNode;
}

export function Sidebar({
  className,
  defaultCollapsed = false,
  children,
  ...props
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div
        className={cn(
          "flex flex-col h-screen",
          "border-r border-gray-200 dark:border-gray-800",
          "shadow-md",
          isCollapsed ? "w-16" : "w-64",
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showTitle?: boolean;
}

export function SidebarHeader({
  className,
  title = "Menu",
  showTitle = true,
  ...props
}: SidebarHeaderProps) {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div
      className={cn("flex items-center justify-between p-4 border-b", className)}
      {...props}
    >
      {!isCollapsed && showTitle && (
        <h2 className="text-lg font-semibold">{title}</h2>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="ml-auto"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <ScrollArea className={cn("flex-1", className)} {...props}>
      <div className="p-2">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isCollapsed ? "justify-center" : "justify-start",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SidebarFooter({
  className,
  children,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      className={cn("border-t p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
} 