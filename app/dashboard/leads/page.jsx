"use client";

import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import LeadTable from "@/components/leads/LeadTable";
import LeadStats from "@/components/leads/LeadStats";
import LeadForm from "@/components/leads/LeadForm";

export default function LeadsPage() {
  const { leads, addLead, updateLead, getLeadStats } = useLeads();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const stats = getLeadStats();

  const handleAddLead = async (leadData) => {
    await addLead(leadData);
    setShowAddModal(false);
  };

  const handleEditLead = async (leadData) => {
    await updateLead(leadData.id, leadData);
    setEditingLead(null);
  };

  const handleDeleteLead = async (leadId) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      // TODO: Implement delete
      console.log("Delete lead:", leadId);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["admin", "lead_manager", "moderator", "super_admin"]}>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Sales Pipeline</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Leads
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Manage customer leads, track status, and convert to rentals.
            </p>
          </div>
        </div>

        <LeadStats stats={stats} />

        <div className="mt-6">
          <LeadTable
            leads={leads}
            onAdd={() => setShowAddModal(true)}
            onEdit={(lead) => setEditingLead(lead)}
            onDelete={handleDeleteLead}
            userRole={user?.role || "employee"}
            employeeId={user?.employeeId || null}
          />
        </div>

        {showAddModal && (
          <LeadForm
            employee={user}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddLead}
          />
        )}

        {editingLead && (
          <LeadForm
            employee={user}
            initialData={editingLead}
            onClose={() => setEditingLead(null)}
            onSave={handleEditLead}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}