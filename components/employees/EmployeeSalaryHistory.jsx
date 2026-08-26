"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function EmployeeSalaryHistory({ salaryHistory = [] }) {
  const [showAll, setShowAll] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      Paid: {
        class: "bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
      },
      Pending: {
        class: "bg-amber-500/10 text-amber-400",
        icon: <Clock size={14} />,
      },
      Overdue: {
        class: "bg-red-500/10 text-red-400",
        icon: <AlertCircle size={14} />,
      },
    };
    return variants[status] || variants.Pending;
  };

  // Show only 3 rows initially
  const displayHistory = showAll ? salaryHistory : salaryHistory.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Salary History</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monthly salary payment records.
            </p>
          </div>
          {salaryHistory.length > 3 && (
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
                  Show More ({salaryHistory.length - 3} more)
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {salaryHistory.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500">No salary records available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Month
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Deductions
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Paid At
                </th>
              </tr>
            </thead>

            <tbody>
              {displayHistory.map((record) => {
                const statusBadge = getStatusBadge(record.status);
                const totalDeduction = record.deductions?.total || 0;

                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-800/70 transition hover:bg-slate-950/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-300">
                      {record.month}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                      Rs. {record.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {totalDeduction > 0 ? (
                        <span className="text-red-400">
                          - Rs. {totalDeduction.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${statusBadge.class}`}
                      >
                        {statusBadge.icon}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {record.paidAt
                        ? new Date(record.paidAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {salaryHistory.length > 3 && (
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
                    View All ({salaryHistory.length} records)
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