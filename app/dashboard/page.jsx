"use client";

import {
  Building2,
  Wallet,
  Users,
  DoorOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserPlus,
  Home,
  AlertCircle,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Alerts from "@/components/dashboard/Alerts";
import LeadsCard from "@/components/dashboard/LeadsCard";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <DashboardHeader />

     

      {/* Main Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Buildings"
          value="12"
          icon={Building2}
          description="48 total rooms"
          href="/dashboard/buildings"
          trend={{ value: 8, label: "vs last month" }}
        />

        <StatCard
          title="Total Revenue"
          value="Rs. 680K"
          icon={Wallet}
          description="+12.5% from last month"
          href="/dashboard/revenue"
          trend={{ value: 12.5, label: "vs last month", positive: true }}
        />

        <StatCard
          title="Total Employees"
          value="24"
          icon={Users}
          description="3 salaries pending"
          href="/dashboard/employees"
          trend={{ value: 5, label: "vs last month", positive: true }}
        />

        <StatCard
          title="Occupied Rooms"
          value="38 / 48"
          icon={DoorOpen}
          description="10 rooms available"
          href="/dashboard/buildings"
          trend={{ value: 79, label: "occupancy rate", positive: true }}
        />
      </div>

      {/* Chart + Leads Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <LeadsCard />
        </div>
      </div>

      {/* Activity + Alerts */}
      <div className="grid gap-5 xl:grid-cols-2">
        <RecentActivity />
        <Alerts />
      </div>
    </div>
  );
}