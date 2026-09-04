"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Mail, Building2, Tag, Calendar, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useLeads } from "@/context/LeadContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { leads, deleteLead, loading } = useLeads();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (params.id) {
      const found = leads.find(l => l._id === params.id || l.id === params.id);
      if (found) {
        setLead(found);
      }
    }
  }, [params.id, leads]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/dashboard/leads" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white">
          <ArrowLeft size={16} />
          Back to Leads
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <h2 className="text-xl font-semibold">Lead Not Found</h2>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(lead._id || lead.id);
      router.push("/dashboard/leads");
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white">
            <ArrowLeft size={16} />
            Back to Leads
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/leads/edit/${lead._id || lead.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Pencil size={16} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Lead Details Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{lead.customerName}</h1>
              <p className="text-sm text-slate-500">Lead Details</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Phone</p>
              <p className="mt-1 text-sm font-medium">{lead.customerPhone}</p>
            </div>
            {lead.customerEmail && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 text-sm font-medium">{lead.customerEmail}</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Type</p>
              <p className="mt-1 text-sm font-medium">{lead.type}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Status</p>
              <p className="mt-1 text-sm font-medium">{lead.status}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Source</p>
              <p className="mt-1 text-sm font-medium">{lead.source}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Assigned To</p>
              <p className="mt-1 text-sm font-medium">
                {lead.assignedToName || (typeof lead.assignedTo === 'object' ? lead.assignedTo?.name : 'Unassigned')}
              </p>
            </div>
          </div>

          {lead.remarks && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2">Remarks</p>
              <p className="text-sm text-slate-300">{lead.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}