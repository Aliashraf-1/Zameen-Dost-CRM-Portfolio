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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Security History
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Security deposit received and returned.
            </p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No security transactions available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/70">
          {history.map((item, index) => {
            const received =
              item.type === "received";
            const forfeited =
              item.type === "forfeited";

            return (
              <div
                key={item._id || item.id || `${item.date}-${index}`}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2.5 ${
                      received
                        ? "bg-emerald-500/10 text-emerald-400"
                        : forfeited
                        ? "bg-red-500/10 text-red-400"
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
                        : forfeited
                        ? "Security Forfeited"
                        : "Security Returned"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.note || "Security transaction"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
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
                      : forfeited
                      ? "text-red-400"
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