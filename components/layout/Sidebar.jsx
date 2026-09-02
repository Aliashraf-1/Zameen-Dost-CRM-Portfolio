"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, X } from "lucide-react";
import { sidebarItems } from "@/data/sidebar";
import { useAuth } from "@/context/AuthContext"; // ✅ Add this

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const pathname = usePathname();
  const { user } = useAuth(); // ✅ Get current user
  const userRole = user?.role || "employee";

  // ✅ Filter sidebar items based on user role
  const visibleItems = sidebarItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r border-border bg-background transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-border px-5 transition-colors duration-300">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-600/40">
              <Building2 size={21} className="transition-transform duration-300 hover:rotate-12" />
            </div>

            <div className={`overflow-hidden transition-all duration-500 ${
              sidebarOpen ? "max-w-48 opacity-100" : "max-w-0 opacity-0"
            }`}>
              <h1 className="whitespace-nowrap text-sm font-bold text-foreground">
                Zameen Dost Marketing
              </h1>
              <p className="text-xs text-muted-foreground">
                Building Management
              </p>
            </div>
          </div>

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:rotate-90 lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation - Only show visible items */}
        <nav className="space-y-2 p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.href === "/dashboard";
            const active = isDashboard
              ? pathname === "/dashboard"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${!sidebarOpen ? "justify-center" : ""}`}
              >
                <Icon 
                  size={20} 
                  className={`shrink-0 transition-transform duration-300 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`} 
                />

                <span 
                  className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 ${
                    sidebarOpen 
                      ? "max-w-48 opacity-100" 
                      : "max-w-0 opacity-0"
                  }`}
                >
                  {item.title}
                </span>

                {/* Active indicator */}
                {active && (
                  <span className="absolute -right-0.5 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white/50" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}