import Link from "next/link";
import {
  Building2,
  DoorOpen,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

export default function BuildingCard({ building }) {
  const rooms = Array.isArray(building?.rooms)
    ? building.rooms
    : [];

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
      (total, room) =>
        total + Number(room?.monthlyRent || 0),
      0
    );

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Building2 size={22} />
          </div>

          <div>
            <h3 className="font-semibold">
              {building?.buildingNo || "Unnamed Building"}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {building?.reference || "No reference"}
            </p>
          </div>

        </div>

        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          {building?.status || "Unknown"}
        </span>

      </div>

      {/* Address */}
      <p className="mt-5 text-sm text-slate-400">
        {building?.address || "No address available"}
      </p>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        {/* Total Rooms */}
        <div className="rounded-xl bg-slate-950/60 p-3">

          <div className="flex items-center gap-2 text-slate-500">
            <DoorOpen size={16} />

            <span className="text-xs">
              Rooms
            </span>
          </div>

          <p className="mt-2 font-semibold">
            {totalRooms}
          </p>

        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl bg-slate-950/60 p-3">

          <div className="flex items-center gap-2 text-slate-500">
            <Wallet size={16} />

            <span className="text-xs">
              Revenue
            </span>
          </div>

          <p className="mt-2 font-semibold">
            Rs. {monthlyRevenue.toLocaleString()}
          </p>

        </div>

      </div>

      {/* Bottom Stats */}
      <div className="mt-5 flex items-center justify-between text-xs">

        <div className="flex gap-4">

          <span className="text-emerald-400">
            {rentedRooms} rented
          </span>

          <span className="text-slate-500">
            {availableRooms} available
          </span>

        </div>

        {/* View */}
        <Link
          href={`/dashboard/buildings/${building?.id}`}
          className="flex items-center gap-1 font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          View

          <ArrowUpRight size={14} />
        </Link>

      </div>

    </div>
  );
}



