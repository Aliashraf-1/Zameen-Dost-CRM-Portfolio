"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { leadAPI } from "@/lib/api";

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load leads from API
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getAll();
      setLeads(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to load leads:", error);
      setError(error.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add lead
  const addLead = async (leadData) => {
    try {
      const response = await leadAPI.create(leadData);
      const newLead = response.data.data;
      setLeads(prev => [newLead, ...prev]);
      return newLead;
    } catch (error) {
      console.error("Failed to add lead:", error);
      throw error;
    }
  };

  // ✅ Update lead
  const updateLead = async (id, leadData) => {
    try {
      const response = await leadAPI.update(id, leadData);
      const updatedLead = response.data.data;
      setLeads(prev => prev.map(l => l._id === id ? updatedLead : l));
      return updatedLead;
    } catch (error) {
      console.error("Failed to update lead:", error);
      throw error;
    }
  };

  // ✅ Delete lead
  const deleteLead = async (id) => {
    try {
      await leadAPI.delete(id);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (error) {
      console.error("Failed to delete lead:", error);
      throw error;
    }
  };

  // ✅ Add note to lead
  const addNote = async (leadId, noteData) => {
    try {
      const response = await leadAPI.addNote(leadId, noteData);
      const updatedLead = response.data.data;
      setLeads(prev => prev.map(l => l._id === leadId ? updatedLead : l));
      return updatedLead;
    } catch (error) {
      console.error("Failed to add note:", error);
      throw error;
    }
  };

  // ✅ Get leads by employee
  const getLeadsByEmployee = (employeeId) => {
    return leads.filter((lead) => lead.assignedTo === Number(employeeId) || lead.assignedTo === employeeId);
  };

  // ✅ Get lead stats
  const getLeadStats = (employeeId = null) => {
    const filtered = employeeId ? getLeadsByEmployee(employeeId) : leads;
    const total = filtered.length;
    const newLeads = filtered.filter((l) => l.status === "New").length;
    const contacted = filtered.filter((l) => l.status === "Contacted").length;
    const qualified = filtered.filter((l) => l.status === "Qualified").length;
    const converted = filtered.filter((l) => l.status === "Converted").length;
    const lost = filtered.filter((l) => l.status === "Lost").length;

    return { total, new: newLeads, contacted, qualified, converted, lost };
  };

  const value = useMemo(
    () => ({
      leads,
      setLeads,
      loading,
      error,
      loadLeads,
      addLead,
      updateLead,
      deleteLead,
      addNote,
      getLeadsByEmployee,
      getLeadStats,
    }),
    [leads, loading, error]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used inside LeadProvider");
  }
  return context;
};