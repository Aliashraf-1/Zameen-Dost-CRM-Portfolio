"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Plus,
  ReceiptText,
  Settings,
} from "lucide-react";

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationPulse, setNotificationPulse] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Pulse animation for notification
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationPulse((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentTheme = mounted ? (theme || resolvedTheme || "dark") : "dark";
  const isDark = currentTheme === "dark";

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-xl transition-all duration-500 sm:px-6 lg:px-8">
      
      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="group shrink-0 rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:shadow-lg active:scale-95"
      >
        <Menu 
          size={21} 
          className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            sidebarOpen ? "rotate-90" : "rotate-0"
          } `}
        />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Add Fund */}
        <button className="group hidden items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-105 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 sm:flex">
          <Plus size={17} className="transition-transform duration-300 group-hover:rotate-90" />
          Add Fund
        </button>

        {/* Expense */}
        <button className="group hidden items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-indigo-500/50 hover:bg-muted hover:text-foreground hover:shadow-lg active:scale-95 sm:flex">
          <ReceiptText size={17} className="transition-transform duration-300 group-hover:scale-110" />
          Expense
        </button>

        {/* Notifications */}
        <button className="group relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:shadow-lg active:scale-95">
          <Bell size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          
          <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 transition-all duration-500 ${
            notificationPulse ? "scale-100 opacity-100" : "scale-75 opacity-70"
          }`}>
            <span className={`absolute inset-0 rounded-full bg-red-500 transition-all duration-500 ${
              notificationPulse ? "animate-ping" : ""
            }`} />
          </span>
        </button>

        {/* Theme Toggle - Smooth Animation */}
        <button
          onClick={toggleTheme}
          className="group relative rounded-xl p-2.5 text-muted-foreground transition-all duration-500 hover:bg-muted hover:text-foreground hover:shadow-lg active:scale-95"
          aria-label="Toggle theme"
        >
          <div className="relative h-5 w-5">
            {/* Sun */}
            <Sun 
              size={20} 
              className={`absolute inset-0 text-yellow-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isDark 
                  ? "rotate-0 scale-100 opacity-100" 
                  : "-rotate-180 scale-0 opacity-0"
              }`}
            />
            
            {/* Moon */}
            <Moon 
              size={20} 
              className={`absolute inset-0 text-slate-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isDark 
                  ? "rotate-180 scale-0 opacity-0" 
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
          </div>

          {/* Hover glow effect */}
          <span className={`absolute inset-0 rounded-xl transition-all duration-500 ${
            isDark 
              ? "bg-yellow-400/10 opacity-0 group-hover:opacity-100 group-hover:scale-110" 
              : "bg-indigo-400/10 opacity-0 group-hover:opacity-100 group-hover:scale-110"
          }`} />
        </button>

        {/* Settings */}
        <button className="group rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:shadow-lg active:scale-95">
          <Settings size={20} className="transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>
    </header>
  );
}