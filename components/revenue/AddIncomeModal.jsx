"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Plus, Wallet, Building2, DoorOpen, Users, CreditCard } from "lucide-react";
import ModalPortal from "@/components/common/ModalPortal";
import { useBuildings } from "@/context/BuildingContext";

const INCOME_TYPES = ["Rent", "Security", "Other"];

export default function AddIncomeModal({ onClose, onSave }) {
  const { buildings } = useBuildings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "Rent",
    amount: "",
    description: "",
    source: "",
    buildingId: "",
    unitId: "",
    deskId: null,
  });

  const [customType, setCustomType] = useState("");

  // Get selected building
  const selectedBuilding = useMemo(() => {
    if (!form.buildingId) return null;
    return buildings.find(b => b.id === Number(form.buildingId));
  }, [form.buildingId, buildings]);

  // Get units of selected building
  const availableUnits = useMemo(() => {
    if (!selectedBuilding) return [];
    return selectedBuilding.rooms || [];
  }, [selectedBuilding]);

  // Get selected unit
  const selectedUnit = useMemo(() => {
    if (!form.unitId) return null;
    return availableUnits.find(u => u.id === Number(form.unitId));
  }, [form.unitId, availableUnits]);

  // Rent payment card for selected unit
  const rentCard = useMemo(() => {
    if (!selectedUnit || form.type !== "Rent") return null;
    const tenant = selectedUnit.tenant;
    if (!tenant) return null;
    return {
      unitNo: selectedUnit.unitNo,
      tenantName: tenant.name,
      monthlyRent: selectedUnit.monthlyRent,
      security: selectedUnit.initialPayment?.securityReceived || 0,
      rentStartDate: selectedUnit.rentStartDate,
    };
  }, [selectedUnit, form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuildingChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      buildingId: val,
      unitId: "",
      deskId: null,
    }));
  };

  const handleUnitChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      unitId: val,
      deskId: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // If Rent, ensure unit is selected
    if (form.type === "Rent" && !form.unitId) {
      setError("Please select a unit for rent payment.");
      return;
    }

    if (form.type === "Other" && !customType.trim()) {
      setError("Please enter a custom category.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let incomeData = {
        type: "Income",
        transactionType: "Income",
        category: form.type === "Other" ? customType : form.type,
        description: form.description || form.category,
        amount: Number(form.amount),
        source: form.source || "N/A",
        status: "Received",
        createdAt: new Date().toISOString(),
        buildingId: form.buildingId || null,
        unitId: form.unitId || null,
      };

      // If Rent, also update the unit's rent history (via context)
      if (form.type === "Rent" && selectedUnit) {
        incomeData = {
          ...incomeData,
          rentPayment: {
            buildingId: Number(form.buildingId),
            unitId: Number(form.unitId),
            months: 1,
            amount: Number(form.amount),
            remarks: form.description || "Rent payment via revenue",
          },
        };
      }

      await onSave(incomeData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to add income.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Add Income</h2>
                <p className="text-xs text-muted-foreground">Record received payment</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {/* Income Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Income Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-card-foreground outline-none focus:border-indigo-500"
              >
                {INCOME_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Custom Type if Other */}
            {form.type === "Other" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Custom Category *</label>
                <input
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="e.g., Commission"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {/* Building Selection (only for Rent) */}
            {form.type === "Rent" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-card-foreground">Building</label>
                  <div className="relative">
                    <Building2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={form.buildingId}
                      onChange={handleBuildingChange}
                      className="w-full rounded-xl border border-border bg-input py-3 pl-11 pr-4 text-sm text-card-foreground outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="">Select Building</option>
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>{b.buildingNo} - {b.reference}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedBuilding && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-card-foreground">Unit</label>
                    <div className="relative">
                      <DoorOpen size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={form.unitId}
                        onChange={handleUnitChange}
                        className="w-full rounded-xl border border-border bg-input py-3 pl-11 pr-4 text-sm text-card-foreground outline-none focus:border-indigo-500 appearance-none"
                      >
                        <option value="">Select Unit</option>
                        {availableUnits.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.unitNo} - {u.type} {u.status === "Rented" ? "(Rented)" : "(Available)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Rent Card Preview */}
                {rentCard && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-xs text-muted-foreground">Rent Payment Details</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit</span>
                        <span className="text-foreground">{rentCard.unitNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenant</span>
                        <span className="text-foreground">{rentCard.tenantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="text-emerald-400">Rs. {rentCard.monthlyRent.toLocaleString()}</span>
                      </div>
                      {rentCard.security > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Security Held</span>
                          <span className="text-amber-400">Rs. {rentCard.security.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Amount (Rs.) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Description / Remarks</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description"
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            {/* Source */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Source</label>
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Customer/Unit"
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                <Plus size={17} />
                {loading ? "Adding..." : "Add Income"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}