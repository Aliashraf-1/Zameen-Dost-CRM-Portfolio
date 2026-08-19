const activities = [
  {
    title: "Rent payment received",
    description: "Building #03 — Faisalabad Road",
    amount: "+ Rs. 45,000",
    time: "12 min ago",
  },
  {
    title: "New employee added",
    description: "Muhammad Ahmed — Office Boy",
    amount: "",
    time: "1 hour ago",
  },
  {
    title: "Maintenance expense",
    description: "Building #01 — Electricity",
    amount: "- Rs. 18,500",
    time: "3 hours ago",
  },
  {
    title: "Room rented",
    description: "Building #02 — Room 204",
    amount: "+ Rs. 32,000",
    time: "5 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest activity across your properties
          </p>
        </div>

        <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
          View all
        </button>
      </div>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />

              <div>
                <p className="text-sm font-medium">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {activity.time}
                </p>
              </div>
            </div>

            {activity.amount && (
              <span className="whitespace-nowrap text-sm font-semibold">
                {activity.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}