"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export default function BuildingFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search buildings..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
        />
      </div>

      <div className="relative lg:w-48">
        <SlidersHorizontal
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500"
        >
          <option value="All">All Buildings</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}