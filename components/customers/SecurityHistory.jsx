import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function SecurityHistory({
  customer,
}) {
  const history =
    customer.securityHistory || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Security History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Security deposit received and returned.
            </p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500">
            No security transactions available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/70">
          {history.map((item) => {
            const received =
              item.type === "received";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-950/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2.5 ${
                      received
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {received ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {received
                        ? "Security Received"
                        : "Security Returned"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.note || "Security transaction"}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {item.date
                        ? new Date(
                            item.date
                          ).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm font-semibold ${
                    received
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {received ? "+" : "-"} Rs.{" "}
                  {Number(
                    item.amount || 0
                  ).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}