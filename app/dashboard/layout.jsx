"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import { BuildingProvider } from "@/context/BuildingContext";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  return (
    <BuildingProvider>
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div
          className={`min-h-screen transition-all duration-300 ${
            sidebarOpen
              ? "lg:pl-64"
              : "lg:pl-20"
          }`}
        >
          <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="p-5 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </BuildingProvider>
  );
}