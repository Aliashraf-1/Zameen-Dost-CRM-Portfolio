"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { leads as initialLeads } from "@/data/leads";

const LeadContext = createContext(null);
const STORAGE_KEY = "bms-leads";

function getInitialData() {
  if (typeof window === "undefined") return initialLeads;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load leads:", error);
  }
  return initialLeads;
}

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(getInitialData);

  useState(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: leadData.notes || [],
    };
    setLeads([newLead, ...leads]);
    return newLead;
  };

  const updateLead = (leadId, updates) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  };

  const addNote = (leadId, noteText, employeeId, employeeName) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              notes: [
                ...(lead.notes || []),
                {
                  id: Date.now(),
                  text: noteText,
                  createdAt: new Date().toISOString(),
                  createdBy: employeeId,
                  createdByName: employeeName,
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : lead
      )
    );
  };

  const getLeadsByEmployee = (employeeId) => {
    return leads.filter((lead) => lead.assignedTo === employeeId);
  };

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
      addLead,
      updateLead,
      addNote,
      getLeadsByEmployee,
      getLeadStats,
    }),
    [leads]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used inside LeadProvider");
  return context;
};