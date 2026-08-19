"use client";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

export default function RentHistory({
  customer,
}) {
  const history = customer.rentHistory || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-lg font-semibold">
          Rent History
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly rent payment records.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500">
            No rent history available.
          </p>
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
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Paid At
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((payment) => {
                const paid =
                  payment.status === "Paid";

                const pending =
                  payment.status === "Pending";

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-800/70 transition hover:bg-slate-950/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {payment.month}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Rs.{" "}
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {paid ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 size={14} />
                          Paid
                        </span>
                      ) : pending ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-400">
                          <Clock3 size={14} />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400">
                          <AlertCircle size={14} />
                          {payment.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {payment.paidAt
                        ? new Date(
                            payment.paidAt
                          ).toLocaleString()
                        : "—"}
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