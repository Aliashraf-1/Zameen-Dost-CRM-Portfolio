"use client";

import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function EmployeeAttendance({ attendance = [] }) {
  const getStatusBadge = (status) => {
    const variants = {
      Present: {
        class: "bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
      },
      Absent: {
        class: "bg-red-500/10 text-red-400",
        icon: <XCircle size={14} />,
      },
      Leave: {
        class: "bg-amber-500/10 text-amber-400",
        icon: <Clock size={14} />,
      },
    };
    return variants[status] || variants.Absent;
  };

  // Get last 30 days of attendance
  const recentAttendance = attendance.slice(-30).reverse();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-lg font-semibold">Attendance History</h2>
        <p className="mt-1 text-sm text-slate-500">Last 30 days of attendance records.</p>
      </div>

      {recentAttendance.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500">No attendance records available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentAttendance.map((record, index) => {
                const statusBadge = getStatusBadge(record.status);

                return (
                  <tr
                    key={index}
                    className="border-b border-slate-800/70 transition hover:bg-slate-950/50"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${statusBadge.class}`}
                      >
                        {statusBadge.icon}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}