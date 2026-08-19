import {
  Building2,
  Wallet,
  Users,
  DoorOpen,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Alerts from "@/components/dashboard/Alerts";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <DashboardHeader />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Buildings"
          value="12"
          icon={Building2}
          description="48 total rooms"
          href="/dashboard/buildings"
        />

        <StatCard
          title="Total Revenue"
          value="Rs. 680K"
          icon={Wallet}
          description="+12.5% from last month"
          href="/dashboard/revenue"
        />

        <StatCard
          title="Total Employees"
          value="24"
          icon={Users}
          description="3 salaries pending"
          href="/dashboard/employees"
        />

        <StatCard
          title="Occupied Rooms"
          value="38 / 48"
          icon={DoorOpen}
          description="10 rooms available"
          href="/dashboard/buildings"
        />
      </div>

      {/* Revenue */}
      <div className="mt-5">
        <RevenueChart />
      </div>

      {/* Activity + Alerts */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <RecentActivity />
        <Alerts />
      </div>
    </div>
  );
}