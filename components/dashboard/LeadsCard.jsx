"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function LeadsCard() {
  const [leads] = useState([
    {
      id: 1,
      name: "Ali Hassan",
      phone: "0300-1234567",
      email: "ali@example.com",
      property: "Building #01 - Unit 101",
      status: "Active",
      time: "2 hours ago",
      type: "Inquiry",
    },
    {
      id: 2,
      name: "Sara Khan",
      phone: "0311-9876543",
      email: "sara@example.com",
      property: "Building #02 - Unit 201",
      status: "Pending",
      time: "5 hours ago",
      type: "Visit",
    },
    {
      id: 3,
      name: "Usman Malik",
      phone: "0322-5554444",
      email: "usman@example.com",
      property: "Building #03 - Unit 301",
      status: "Closed",
      time: "1 day ago",
      type: "Booking",
    },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-emerald-500/10 text-emerald-400",
      Pending: "bg-amber-500/10 text-amber-400",
      Closed: "bg-blue-500/10 text-blue-400",
    };
    return colors[status] || colors.Pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Active: <CheckCircle2 size={12} />,
      Pending: <Clock size={12} />,
      Closed: <XCircle size={12} />,
    };
    return icons[status] || icons.Pending;
  };

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Leads</h2>
          <p className="mt-0.5 text-xs text-slate-500">New inquiries and prospects</p>
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white">
          View All
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Stats - Compact */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
          <p className="text-base font-bold text-emerald-400">8</p>
          <p className="text-[10px] text-slate-500">Active</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
          <p className="text-base font-bold text-amber-400">5</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
          <p className="text-base font-bold text-blue-400">12</p>
          <p className="text-[10px] text-slate-500">Closed</p>
        </div>
      </div>

      {/* Leads List - Compact */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-lg border border-slate-800 bg-slate-950/30 p-2.5 transition hover:border-slate-700 hover:bg-slate-950/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-medium text-indigo-400">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lead.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Phone size={10} />
                        {lead.phone}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:inline-block" />
                      <span className="hidden items-center gap-0.5 sm:flex">
                        <Mail size={10} />
                        {lead.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-slate-500">
                    <Building2 size={11} />
                    {lead.property}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span className="text-slate-500">{lead.time}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">
                  {lead.type}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-medium ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {getStatusIcon(lead.status)}
                  {lead.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Button - Compact */}
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-medium text-slate-400 transition hover:border-indigo-500 hover:bg-indigo-500/5 hover:text-indigo-400">
        <UserPlus size={14} />
        Add New Lead
      </button>
    </div>
  );
}