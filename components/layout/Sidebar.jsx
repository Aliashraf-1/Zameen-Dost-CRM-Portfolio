"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, X } from "lucide-react";
import { sidebarItems } from "@/data/sidebar";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
              <Building2 size={21} />
            </div>

            {sidebarOpen && (
              <div>
                <h1 className="whitespace-nowrap text-sm font-bold">
                  Zameen Dost Marketing
                </h1>

                <p className="text-xs text-slate-400">
                  Building Management
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const isDashboard =
              item.href === "/dashboard";

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
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                {sidebarOpen && (
                  <span className="whitespace-nowrap text-sm font-medium">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}