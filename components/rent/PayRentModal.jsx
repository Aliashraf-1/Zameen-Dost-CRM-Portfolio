"use client";

import { useMemo, useState } from "react";
import {
  X,
  Wallet,
  CheckCircle2,
} from "lucide-react";

import { useBuildings } from "@/context/BuildingContext";

export default function PayRentModal({
  buildingId,
  room,
  onClose,
}) {
  const { payRent } = useBuildings();

  const [months, setMonths] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const monthlyRent = Number(
    room?.monthlyRent || 0
  );

  const amount = useMemo(
    () =>
      monthlyRent *
      Number(months || 0),
    [monthlyRent, months]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!months || months < 1) {
      return;
    }

    setLoading(true);

    try {
      payRent(
        buildingId,
        room.id,
        months
      );

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Pay Rent
              </h2>

              <p className="text-xs text-slate-500">
                Unit {room.unitNo}
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

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="text-xs text-slate-500">
              Customer
            </p>

            <p className="mt-1 font-medium">
              {room.tenant?.name ||
                "Unknown Customer"}
            </p>

          </div>

          {/* Monthly Rent */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Monthly Rent
            </label>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
              Rs.{" "}
              {monthlyRent.toLocaleString()}
            </div>

          </div>

          {/* Months */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Months to Pay
            </label>

            <input
              type="number"
              min="1"
              value={months}
              onChange={(e) =>
                setMonths(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

          </div>

          {/* Total */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Total Payment
              </span>

              <span className="text-xl font-bold text-emerald-400">
                Rs.{" "}
                {amount.toLocaleString()}
              </span>

            </div>

          </div>

          <p className="text-xs text-slate-600">
            Payment date and time will be recorded automatically.
          </p>

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400">
              <CheckCircle2 size={17} />
              Rent payment recorded successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading || success
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wallet size={17} />

            {loading
              ? "Processing..."
              : "Confirm Payment"}
          </button>

        </form>
      </div>
    </div>
  );
}