"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Calendar } from "lucide-react";

export default function EmployeeAttendance({ attendance = [] }) {
  const [showAll, setShowAll] = useState(false);

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
      "Friday Off": {
        class: "bg-blue-500/10 text-blue-400",
        icon: <Calendar size={14} />,
      },
    };
    return variants[status] || variants.Absent;
  };

  // ✅ Check if a date is Friday
  const isFriday = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 5; // 5 = Friday
  };

  // ✅ Process attendance - mark Fridays as "Friday Off" if not already marked
  const processedAttendance = attendance.map((record) => {
    if (isFriday(record.date) && record.status !== "Present") {
      return { ...record, status: "Friday Off" };
    }
    return record;
  });

  // Get last 30 days of attendance (most recent first)
  const recentAttendance = processedAttendance.slice(-30).reverse();

  // Show only 4 records initially
  const displayAttendance = showAll ? recentAttendance : recentAttendance.slice(0, 4);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Attendance History</h2>
            <p className="mt-1 text-sm text-slate-500">Last 30 days of attendance records.</p>
          </div>
          {recentAttendance.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show More ({recentAttendance.length - 4} more)
                </>
              )}
            </button>
          )}
        </div>
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
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Check In
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Check Out
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Late (min)
                </th>
              </tr>
            </thead>

            <tbody>
              {displayAttendance.map((record, index) => {
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
                      {record.status === "Friday Off" && (
                        <span className="ml-2 text-xs text-blue-400/70">(Weekly Off)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {record.checkIn || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {record.checkOut || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {record.lateMinutes > 0 ? (
                        <span className="text-amber-400">{record.lateMinutes}</span>
                      ) : (
                        "0"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {recentAttendance.length > 4 && (
            <div className="border-t border-slate-800 p-3 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1 text-sm text-indigo-400 transition hover:text-indigo-300"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={16} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    View All ({recentAttendance.length} records)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}