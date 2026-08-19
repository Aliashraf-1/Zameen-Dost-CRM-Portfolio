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
} from "lucide-react";

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      
      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Menu size={21} />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Add Fund */}
        <button
          className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 sm:flex"
        >
          <Plus size={17} />
          Add Fund
        </button>

        {/* Expense */}
        <button
          className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:flex"
        >
          <ReceiptText size={17} />
          Expense
        </button>

        {/* Notifications */}
        <button className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Theme */}
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )
          ) : (
            <Moon size={20} />
          )}
        </button>
      </div>
    </header>
  );
}