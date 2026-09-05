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
      console.log("📋 Leads loaded:", response.data.data);
      setLeads(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to load leads:", error);
      setError(error.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData) => {
  try {
    console.log("📤 LeadContext addLead:", leadData); // Debug
    const response = await leadAPI.create(leadData);
    const newLead = response.data.data;
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  } catch (error) {
    console.error("Failed to add lead:", error);
    throw error;
  }
};

  const updateLead = async (id, leadData) => {
    try {
      const response = await leadAPI.update(id, leadData);
      const updatedLead = response.data.data;
      setLeads(prev => prev.map(l => (l._id === id || l.id === id) ? updatedLead : l));
      return updatedLead;
    } catch (error) {
      console.error("Failed to update lead:", error);
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadAPI.delete(id);
      setLeads(prev => prev.filter(l => l._id !== id && l.id !== id));
    } catch (error) {
      console.error("Failed to delete lead:", error);
      throw error;
    }
  };

  const addNote = async (leadId, noteData) => {
    try {
      const response = await leadAPI.addNote(leadId, noteData);
      const updatedLead = response.data.data;
      setLeads(prev => prev.map(l => (l._id === leadId || l.id === leadId) ? updatedLead : l));
      return updatedLead;
    } catch (error) {
      console.error("Failed to add note:", error);
      throw error;
    }
  };

  // ✅ Fixed: Get leads by employee - Handle all ID formats
  const getLeadsByEmployee = (employeeId) => {
    if (!employeeId) {
      console.log("❌ No employeeId provided");
      return [];
    }
    
    const empIdStr = String(employeeId);
    console.log("🔍 Searching leads for employee:", empIdStr);
    console.log("📋 Total leads in context:", leads.length);
    
    const filtered = leads.filter((lead) => {
      const assignedTo = lead.assignedTo;
      
      // ✅ If assignedTo is populated object
      if (typeof assignedTo === 'object' && assignedTo !== null) {
        const assignedId = assignedTo._id || assignedTo.id;
        const match = String(assignedId) === empIdStr;
        if (match) console.log("✅ Match found (object):", lead.customerName);
        return match;
      }
      
      // ✅ If assignedTo is primitive
      const match = String(assignedTo) === empIdStr || assignedTo === Number(employeeId);
      if (match) console.log("✅ Match found (primitive):", lead.customerName);
      return match;
    });
    
    console.log("📊 Leads found for employee:", filtered.length);
    return filtered;
  };

  // ✅ Get lead stats
  const getLeadStats = (employeeId = null) => {
    const filtered = employeeId ? getLeadsByEmployee(employeeId) : leads;
    const total = filtered.length;
    const newLeads = filtered.filter((l) => l.status === "New").length;
    const contacted = filtered.filter((l) => l.status === "Contacted").length;
    const qualified = filtered.filter((l) => l.status === "Qualified").length;
    const converted = filtered.filter((l) => l.status === "Converted" || l.status === "Closed").length;
    const lost = filtered.filter((l) => l.status === "Lost").length;
    
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return { total, new: newLeads, contacted, qualified, converted, lost, conversionRate };
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