"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { BuildingProvider } from "@/context/BuildingContext";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { RevenueProvider } from "@/context/RevenueContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BuildingProvider>
      <RevenueProvider>
        <EmployeeProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            <div
              className={`min-h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                sidebarOpen ? "lg:pl-64" : "lg:pl-20"
              }`}
            >
              <Topbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              <main className="p-5 transition-all duration-300 sm:p-6 lg:p-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </EmployeeProvider>
      </RevenueProvider>
    </BuildingProvider>
  );
}