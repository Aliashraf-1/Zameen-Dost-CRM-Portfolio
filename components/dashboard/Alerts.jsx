const alerts = [
  {
    title: "Rent payment pending",
    description: "Room 203 — Building #03",
    type: "Rent",
  },
  {
    title: "Salary payment due",
    description: "Office Boy — Muhammad Ahmed",
    type: "Salary",
  },
  {
    title: "Agreement expiring soon",
    description: "Room 105 — Building #01",
    type: "Agreement",
  },
];

export default function Alerts() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Alerts
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Things that may need your attention
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {alert.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {alert.description}
                </p>
              </div>

              <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400">
                {alert.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}