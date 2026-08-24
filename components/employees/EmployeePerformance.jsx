"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function EmployeePerformance({ employee }) {
  const attendance = employee?.attendance || [];
  const tasks = employee?.tasks || [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === "Present").length;
    const absent = attendance.filter(a => a.status === "Absent").length;
    const leaves = attendance.filter(a => a.status === "Leave").length;
    const attendanceRate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const failed = tasks.filter(t => t.status === "Failed").length;
    const pending = tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    const totalLateMinutes = attendance.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
    const lateDeduction = totalLateMinutes * (employee?.attendanceSettings?.lateDeduction || 10);
    const leaveDeduction = leaves * (employee?.attendanceSettings?.leaveDeduction || 500);
    const taskFailureDeduction = failed * (employee?.attendanceSettings?.taskFailureDeduction || 1000);
    const totalDeduction = lateDeduction + leaveDeduction + taskFailureDeduction;

    return {
      totalDays,
      present,
      absent,
      leaves,
      attendanceRate,
      totalTasks,
      completed,
      failed,
      pending,
      taskCompletionRate,
      totalLateMinutes,
      lateDeduction,
      leaveDeduction,
      taskFailureDeduction,
      totalDeduction,
    };
  }, [attendance, tasks, employee]);

  // Chart options for attendance
  const attendanceChartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false },
      background: "transparent",
    },
    labels: ["Present", "Absent", "Leave"],
    colors: ["#10b981", "#ef4444", "#f59e0b"],
    legend: {
      position: "bottom",
      labels: { colors: "#94a3b8" },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Attendance",
              color: "#94a3b8",
              fontSize: "14px",
              formatter: () => `${stats.attendanceRate}%`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const attendanceSeries = [stats.present, stats.absent, stats.leaves];

  // Chart options for tasks
  const tasksChartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false },
      background: "transparent",
    },
    labels: ["Completed", "Failed", "Pending"],
    colors: ["#10b981", "#ef4444", "#f59e0b"],
    legend: {
      position: "bottom",
      labels: { colors: "#94a3b8" },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Tasks",
              color: "#94a3b8",
              fontSize: "14px",
              formatter: () => `${stats.taskCompletionRate}%`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const tasksSeries = [stats.completed, stats.failed, stats.pending];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={16} />
            Attendance Rate
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.attendanceRate}%</p>
          <p className="text-xs text-slate-500">{stats.present}/{stats.totalDays} days present</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Task Completion
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.taskCompletionRate}%</p>
          <p className="text-xs text-slate-500">{stats.completed}/{stats.totalTasks} completed</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <TrendingDown size={16} className="text-red-400" />
            Total Deductions
          </div>
          <p className="mt-2 text-2xl font-bold text-red-400">
            Rs. {stats.totalDeduction.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            Leaves: {stats.leaves} | Late: {stats.totalLateMinutes}min
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <AlertCircle size={16} className="text-amber-400" />
            Task Status
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-slate-500">Pending tasks</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Attendance Distribution</h3>
          <Chart
            options={attendanceChartOptions}
            series={attendanceSeries}
            type="donut"
            height={280}
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Task Distribution</h3>
          <Chart
            options={tasksChartOptions}
            series={tasksSeries}
            type="donut"
            height={280}
          />
        </div>
      </div>
    </div>
  );
}