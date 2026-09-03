import {
  Building2,
  DoorOpen,
  Home,
  Wallet,
} from "lucide-react";

function SummaryItem({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function BuildingSummary({ building }) {
  // ✅ Support both _id and id from API
  const rooms = Array.isArray(building?.rooms) ? building.rooms : [];

  const totalRooms = rooms.length;

  const rentedRooms = rooms.filter(
    (room) => room?.status === "Rented"
  ).length;

  const availableRooms = rooms.filter(
    (room) => room?.status === "Available"
  ).length;

  const monthlyRevenue = rooms
    .filter((room) => room?.status === "Rented")
    .reduce(
      (total, room) => total + Number(room?.monthlyRent || 0),
      0
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Building */}
      <SummaryItem
        icon={Building2}
        title="Building"
        value={building?.buildingNo || "Unnamed Building"}
        description={building?.reference || "No reference"}
      />

      {/* Total Rooms */}
      <SummaryItem
        icon={DoorOpen}
        title="Total Rooms"
        value={totalRooms}
        description="Registered units"
      />

      {/* Available */}
      <SummaryItem
        icon={Home}
        title="Available"
        value={availableRooms}
        description={`${rentedRooms} units currently rented`}
      />

      {/* Monthly Revenue */}
      <SummaryItem
        icon={Wallet}
        title="Monthly Revenue"
        value={`Rs. ${monthlyRevenue.toLocaleString()}`}
        description="Current rental revenue"
      />
    </div>
  );
}