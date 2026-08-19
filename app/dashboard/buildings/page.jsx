"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buildings } from "@/data/buildings";
import BuildingCard from "@/components/buildings/BuildingCard";
import BuildingFilters from "@/components/buildings/BuildingFilters";

export default function BuildingsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      const matchesSearch =
        building.buildingNo
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        building.reference
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || building.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-indigo-400">
            Property Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Buildings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your buildings, rooms and rental properties.
          </p>
        </div>

        <Link
          href="/dashboard/buildings/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          Add Building
        </Link>
      </div>

      <BuildingFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {filteredBuildings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBuildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 py-20 text-center">
          <h3 className="font-semibold">
            No buildings found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}