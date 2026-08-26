"use client";

import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
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
  // ✅ Safe way to use useLeads - if context not available, show fallback
  let leads = [];
  let stats = { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
  
  try {
    const leadContext = useLeads();
    leads = leadContext.leads || [];
    stats = leadContext.getLeadStats() || stats;
  } catch (error) {
    // If LeadProvider not available, use fallback data
    console.warn("LeadProvider not available, using fallback data");
    leads = [
      {
        id: 1,
        customerName: "Ali Hassan",
        customerPhone: "0300-1234567",
        customerEmail: "ali@example.com",
        type: "Hostel",
        status: "Active",
        source: "Referral",
        remarks: "Interested in hostel accommodation",
        assignedTo: 1,
        assignedToName: "Ahmed Hassan",
        createdAt: "2026-08-25T10:00:00.000Z",
        followUpDate: "2026-08-28T10:00:00.000Z",
        notes: [],
      },
      {
        id: 2,
        customerName: "Sara Khan",
        customerPhone: "0311-9876543",
        customerEmail: "sara@example.com",
        type: "Office",
        status: "Pending",
        source: "Website",
        remarks: "Looking for office space",
        assignedTo: 2,
        assignedToName: "Sara Khan",
        createdAt: "2026-08-24T09:00:00.000Z",
        followUpDate: "2026-08-27T14:00:00.000Z",
        notes: [],
      },
      {
        id: 3,
        customerName: "Usman Malik",
        customerPhone: "0322-5554444",
        customerEmail: "usman@example.com",
        type: "Shop",
        status: "Closed",
        source: "Walk-in",
        remarks: "Looking for shop in Satellite Town",
        assignedTo: 1,
        assignedToName: "Ahmed Hassan",
        createdAt: "2026-08-20T10:00:00.000Z",
        followUpDate: null,
        notes: [],
      },
    ];
    stats = {
      total: 3,
      new: 1,
      contacted: 1,
      qualified: 0,
      converted: 0,
      lost: 1,
    };
  }

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-500/10 text-blue-400",
      Contacted: "bg-amber-500/10 text-amber-400",
      Qualified: "bg-green-500/10 text-green-400",
      Converted: "bg-emerald-500/10 text-emerald-400",
      Lost: "bg-red-500/10 text-red-400",
      Active: "bg-emerald-500/10 text-emerald-400",
      Pending: "bg-amber-500/10 text-amber-400",
      Closed: "bg-blue-500/10 text-blue-400",
    };
    return colors[status] || colors.Pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      New: <Clock size={12} />,
      Contacted: <Phone size={12} />,
      Qualified: <CheckCircle2 size={12} />,
      Converted: <CheckCircle2 size={12} />,
      Lost: <XCircle size={12} />,
      Active: <CheckCircle2 size={12} />,
      Pending: <Clock size={12} />,
      Closed: <XCircle size={12} />,
    };
    return icons[status] || icons.Pending;
  };

  // Display only recent 3 leads
  const recentLeads = leads.slice(0, 3);

  // Stats for display
  const displayStats = {
    active: stats.contacted + stats.qualified || 0,
    pending: stats.new || 0,
    closed: stats.converted + stats.lost || 0,
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
          <p className="text-base font-bold text-emerald-400">{displayStats.active}</p>
          <p className="text-[10px] text-slate-500">Active</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
          <p className="text-base font-bold text-amber-400">{displayStats.pending}</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
          <p className="text-base font-bold text-blue-400">{displayStats.closed}</p>
          <p className="text-[10px] text-slate-500">Closed</p>
        </div>
      </div>

      {/* Leads List - Compact */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {recentLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users size={28} className="text-slate-600" />
            <p className="mt-2 text-sm text-slate-500">No leads yet</p>
            <p className="text-xs text-slate-600">Add your first lead</p>
          </div>
        ) : (
          recentLeads.map((lead) => {
            const name = lead.customerName || lead.name || "Unknown";
            const phone = lead.customerPhone || lead.phone || "N/A";
            const email = lead.customerEmail || lead.email || "N/A";
            const type = lead.type || "General";
            const status = lead.status || "New";
            const property = lead.property || `Unit ${lead.unitNo || ''}` || "N/A";
            const time = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "Today";

            return (
              <div
                key={lead.id}
                className="rounded-lg border border-slate-800 bg-slate-950/30 p-2.5 transition hover:border-slate-700 hover:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-medium text-indigo-400">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-0.5">
                            <Phone size={10} />
                            {phone}
                          </span>
                          <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:inline-block" />
                          <span className="hidden items-center gap-0.5 sm:flex">
                            <Mail size={10} />
                            {email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <Building2 size={11} />
                        {property}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="text-slate-500">{time}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">
                      {type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Lead Button - Compact */}
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-medium text-slate-400 transition hover:border-indigo-500 hover:bg-indigo-500/5 hover:text-indigo-400">
        <UserPlus size={14} />
        Add New Lead
      </button>
    </div>
  );
}