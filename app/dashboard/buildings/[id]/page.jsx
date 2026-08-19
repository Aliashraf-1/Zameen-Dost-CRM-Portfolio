import Link from "next/link";
import { notFound } from "next/navigation";
import BuildingUnitTypeChart from "@/components/buildings/BuildingUnitTypeChart";
import {
  ArrowLeft,
  Edit,
  Plus,
  MapPin,
} from "lucide-react";

import { buildings } from "@/data/buildings";
import BuildingSummary from "@/components/buildings/BuildingSummary";
import RoomTable from "@/components/buildings/RoomTable";

export default async function BuildingDetailsPage({
  params,
}) {
  const { id } = await params;

  const building = buildings.find(
    (item) => item.id === Number(id)
  );

  if (!building) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/buildings"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Buildings
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {building.buildingNo}
              </h1>

              <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                {building.status}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />

              {building.address}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/dashboard/buildings/${building.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <Edit size={17} />
              Edit Building
            </Link>

          <Link
                href={`/dashboard/buildings/${building.id}/rooms/new`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                <Plus size={17} />
                Add Unit
         </Link>
          </div>
        </div>
      </div>

      {/* Summary */}
      <BuildingSummary building={building} />
          {/* donut chart */}
      <BuildingUnitTypeChart rooms={building.rooms} />

      {/* Rooms */}
      <div className="mt-6">
        <RoomTable
        rooms={building.rooms}
        buildingId={building.id}
        />
      </div>
    </div>
  );
}