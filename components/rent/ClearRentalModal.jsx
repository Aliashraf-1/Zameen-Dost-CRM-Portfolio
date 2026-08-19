"use client";

import { useMemo, useState } from "react";
import {
  X,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

import { useBuildings } from "@/context/BuildingContext";

export default function ClearRentalModal({
  buildingId,
  room,
  onClose,
}) {
  const { clearRental } =
    useBuildings();

  const securityHeld = Number(
    room?.initialPayment
      ?.securityReceived || 0
  );

  const [returnAmount, setReturnAmount] =
    useState(securityHeld);

  const [forfeitAmount, setForfeitAmount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const total = useMemo(
    () =>
      Number(returnAmount || 0) +
      Number(forfeitAmount || 0),
    [returnAmount, forfeitAmount]
  );

  const handleReturnChange = (e) => {
    const value = Number(
      e.target.value || 0
    );

    setReturnAmount(value);

    setForfeitAmount(
      Math.max(
        securityHeld - value,
        0
      )
    );

    setError("");
  };

  const handleForfeitChange = (e) => {
    const value = Number(
      e.target.value || 0
    );

    setForfeitAmount(value);

    setReturnAmount(
      Math.max(
        securityHeld - value,
        0
      )
    );

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (total !== securityHeld) {
      setError(
        "Return and forfeit amounts must equal the security held."
      );

      return;
    }

    setLoading(true);

    try {
      clearRental(
        buildingId,
        room.id,
        {
          returnAmount,
          forfeitAmount,
        }
      );

      onClose();
    } catch (error) {
      setError(
        error.message ||
          "Unable to clear rental."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldAlert size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Clear Rental
              </h2>

              <p className="text-xs text-slate-500">
                Unit {room?.unitNo}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Customer */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-xs text-slate-500">
              Customer
            </p>

            <p className="mt-1 font-medium">
              {room?.tenant?.name}
            </p>

          </div>

          {/* Security */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Security Held
              </span>

              <span className="text-xl font-bold text-emerald-400">
                Rs.{" "}
                {securityHeld.toLocaleString()}
              </span>

            </div>

          </div>

          {/* Return */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <RotateCcw size={15} />
              Security Returned
            </label>

            <input
              type="number"
              min="0"
              max={securityHeld}
              value={returnAmount}
              onChange={
                handleReturnChange
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

          </div>

          {/* Forfeit */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Security Forfeited
            </label>

            <input
              type="number"
              min="0"
              max={securityHeld}
              value={forfeitAmount}
              onChange={
                handleForfeitChange
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-600">
              Any forfeited amount will become revenue.
            </p>

          </div>

          {/* Validation */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-500">
                Settlement
              </span>

              <span
                className={`text-sm font-semibold ${
                  total === securityHeld
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                Rs.{" "}
                {total.toLocaleString()}
                {" / "}
                {securityHeld.toLocaleString()}
              </span>

            </div>

          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              <CheckCircle2 size={17} />

              {loading
                ? "Clearing..."
                : "Clear Rental"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}