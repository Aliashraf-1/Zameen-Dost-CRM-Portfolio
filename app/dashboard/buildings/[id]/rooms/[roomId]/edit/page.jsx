"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  DoorOpen,
  User,
  Wallet,
  Calendar,
  Phone,
  CreditCard,
  ShieldCheck,
  MapPin,
  Home,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  ArrowUpRight,
} from "lucide-react";
import { buildings as initialBuildings } from "@/data/buildings";
import RentHistory from "@/components/customers/RentHistory";
import SecurityHistory from "@/components/customers/SecurityHistory";

function InfoItem({ icon: Icon, label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon size={15} />
        {label}
      </div>
      <p className={`mt-2 text-sm font-medium ${valueClassName || "text-slate-200"}`}>
        {value || "Not Set"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const variants = {
    Rented: {
      class: "bg-emerald-500/10 text-emerald-400",
      icon: <CheckCircle2 size={16} />,
      label: "Rented",
    },
    Available: {
      class: "bg-blue-500/10 text-blue-400",
      icon: <Home size={16} />,
      label: "Available",
    },
    Maintenance: {
      class: "bg-amber-500/10 text-amber-400",
      icon: <Clock size={16} />,
      label: "Maintenance",
    },
  };

  const variant = variants[status] || variants.Available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${variant.class}`}
    >
      {variant.icon}
      {variant.label}
    </span>
  );
}

export default function UnitDetailsPage() {
  const params = useParams();
  const [buildings] = useState(initialBuildings);
  const [building, setBuilding] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && params.roomId) {
      const foundBuilding = buildings.find(
        (item) => item.id === Number(params.id)
      );
      if (foundBuilding) {
        setBuilding(foundBuilding);
        const foundUnit = foundBuilding.rooms?.find(
          (item) => item.id === Number(params.roomId)
        );
        if (foundUnit) {
          setUnit(foundUnit);
        }
      }
      setLoading(false);
    }
  }, [params.id, params.roomId, buildings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-500">Loading unit details...</div>
      </div>
    );
  }

  if (!building || !unit) {
    notFound();
  }

  const isRented = unit.status === "Rented";
  const tenant = unit.tenant;
  const initialPayment = unit.initialPayment;

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Back Button */}
      <Link
        href={`/dashboard/buildings/${building.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to {building.buildingNo}
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {unit.type} {unit.unitNo}
            </h1>
            <StatusBadge status={unit.status} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={16} />
            {building.buildingNo} — {building.reference}
            <span className="mx-2 text-slate-700">|</span>
            <DoorOpen size={16} />
            {unit.purpose || "Not specified"}
          </div>
          {unit.reference && (
            <p className="mt-1 text-sm text-slate-400">
              Reference: {unit.reference}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/dashboard/buildings/${building.id}/rooms/${unit.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Pencil size={17} />
            Edit Unit
          </Link>
        </div>
      </div>

      {/* Unit Image */}
      {unit.unitImage && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800">
          <img
            src={unit.unitImage}
            alt={`${unit.type} ${unit.unitNo}`}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Unit Information</h2>
          <div className="grid gap-3">
            <InfoItem icon={DoorOpen} label="Unit Number" value={unit.unitNo} />
            <InfoItem icon={Home} label="Type" value={unit.type} />
            <InfoItem icon={FileText} label="Purpose" value={unit.purpose || "Not Set"} />
            <InfoItem icon={Wallet} label="Monthly Rent" value={`Rs. ${(unit.monthlyRent || 0).toLocaleString()}`} />
            <InfoItem icon={Calendar} label="Rent Start Date" value={unit.rentStartDate || "Not Started"} />
            {unit.deskNo && (
              <InfoItem icon={Users} label="Desk Number" value={unit.deskNo} />
            )}
          </div>
        </div>

        {/* Tenant Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Tenant Information</h2>
          {isRented && tenant ? (
            <div className="grid gap-3">
              <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">
                  {tenant.image ? (
                    <img src={tenant.image} alt={tenant.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-xs text-slate-500">{tenant.reference || "No reference"}</p>
                </div>
              </div>
              <InfoItem icon={CreditCard} label="CNIC" value={tenant.cnic} />
              <InfoItem icon={Phone} label="Phone" value={tenant.phone} />
              {tenant.image && (
                <InfoItem icon={User} label="Image" value="Uploaded" />
              )}
              {tenant.agreement && tenant.agreement.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Documents</p>
                  <div className="mt-2 space-y-1">
                    {tenant.agreement.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <FileText size={14} className="text-indigo-400" />
                        <span>Agreement {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 py-8 text-center">
              <Home size={32} className="text-slate-600" />
              <p className="mt-2 text-sm text-slate-500">No tenant assigned</p>
              <p className="text-xs text-slate-600">This unit is currently available</p>
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Financial Information</h2>
          {isRented && initialPayment ? (
            <div className="grid gap-3">
              <InfoItem
                icon={Wallet}
                label="Monthly Rent"
                value={`Rs. ${(unit.monthlyRent || 0).toLocaleString()}`}
                valueClassName="text-emerald-400"
              />
              <InfoItem
                icon={ShieldCheck}
                label="Security Held"
                value={`Rs. ${(initialPayment.securityReceived || 0).toLocaleString()}`}
                valueClassName="text-emerald-400"
              />
              <InfoItem
                icon={Wallet}
                label="Cash Received"
                value={`Rs. ${(initialPayment.cashReceived || 0).toLocaleString()}`}
              />
              <InfoItem
                icon={CheckCircle2}
                label="Rent Paid"
                value={`Rs. ${(initialPayment.rentPaid || 0).toLocaleString()}`}
                valueClassName="text-emerald-400"
              />
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">Payment Date & Time</p>
                <p className="mt-2 text-sm font-medium text-slate-200">
                  {initialPayment.paymentDateTime
                    ? new Date(initialPayment.paymentDateTime).toLocaleString()
                    : "Not recorded"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 py-8 text-center">
              <Wallet size={32} className="text-slate-600" />
              <p className="mt-2 text-sm text-slate-500">No financial records</p>
              <p className="text-xs text-slate-600">This unit is currently available</p>
            </div>
          )}
        </div>
      </div>

      {/* Rent History */}
      {isRented && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RentHistory customer={unit} />
          <SecurityHistory customer={unit} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {isRented && (
            <>
              <Link
                href={`/dashboard/buildings/${building.id}/rooms/${unit.id}/pay-rent`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
              >
                <Wallet size={16} />
                Pay Rent
              </Link>
              <Link
                href={`/dashboard/buildings/${building.id}/rooms/${unit.id}/clear-rental`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500"
              >
                <ArrowUpRight size={16} />
                Clear Rental
              </Link>
            </>
          )}
          <Link
            href={`/dashboard/buildings/${building.id}/rooms/${unit.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Pencil size={16} />
            Edit Unit
          </Link>
        </div>
      </div>
    </div>
  );
}