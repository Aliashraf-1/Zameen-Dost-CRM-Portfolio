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
  Home,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Pencil,
  UserMinus,
  History,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { useBuildings } from "@/context/BuildingContext";
import RentHistory from "@/components/customers/RentHistory";
import SecurityHistory from "@/components/customers/SecurityHistory";
import ClearRentalModal from "@/components/rent/ClearRentalModal";
import PayRentModal from "@/components/rent/PayRentModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

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

// Previous Customer Card Component
function PreviousCustomerCard({ customer, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">
              {customer.tenantImage ? (
                <img
                  src={customer.tenantImage}
                  alt={customer.tenantName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-200">{customer.tenantName}</p>
              <p className="text-xs text-slate-500">
                {customer.unitNo} • {customer.type}
              </p>
              <p className="text-xs text-slate-600">
                Cleared: {new Date(customer.clearedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              title="View details"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
              title="Delete record"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
            {/* Tenant Details */}
            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem icon={User} label="Name" value={customer.tenantName} />
              <InfoItem icon={CreditCard} label="CNIC" value={customer.tenantCnic} />
              <InfoItem icon={Phone} label="Phone" value={customer.tenantPhone} />
              <InfoItem icon={FileText} label="Reference" value={customer.tenantReference || "N/A"} />
            </div>

            {/* Financial Details */}
            <div className="grid gap-3 md:grid-cols-3">
              <InfoItem
                icon={Wallet}
                label="Monthly Rent"
                value={`Rs. ${customer.monthlyRent?.toLocaleString() || "0"}`}
                valueClassName="text-emerald-400"
              />
              <InfoItem
                icon={ShieldCheck}
                label="Security Held"
                value={`Rs. ${customer.securityHeld?.toLocaleString() || "0"}`}
                valueClassName="text-emerald-400"
              />
              <InfoItem
                icon={Wallet}
                label="Security Returned"
                value={`Rs. ${customer.returnAmount?.toLocaleString() || "0"}`}
                valueClassName="text-amber-400"
              />
            </div>

            {/* Remarks */}
            {customer.remarks && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <p className="text-xs text-slate-500">Remarks</p>
                <p className="mt-1 text-sm text-slate-300">{customer.remarks}</p>
              </div>
            )}

            {/* Agreement Documents */}
            {customer.agreement && customer.agreement.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <p className="text-xs text-slate-500">Agreement Documents</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {customer.agreement.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
                    >
                      <FileText size={14} className="text-indigo-400" />
                      <span>Document {index + 1}</span>
                      <button className="ml-1 rounded p-1 hover:bg-slate-700">
                        <Download size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenant Image */}
            {customer.tenantImage && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                <p className="text-xs text-slate-500">Tenant Image</p>
                <div className="mt-2">
                  <img
                    src={customer.tenantImage}
                    alt={customer.tenantName}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {/* Clearance Info */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-slate-500">Clearance Details</p>
              <div className="mt-2 grid gap-1 text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-500">Cleared At:</span>{" "}
                  {new Date(customer.clearedAt).toLocaleString()}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Security Held:</span>{" "}
                  <span className="text-emerald-400">
                    Rs. {customer.securityHeld?.toLocaleString() || "0"}
                  </span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Security Returned:</span>{" "}
                  <span className="text-amber-400">
                    Rs. {customer.returnAmount?.toLocaleString() || "0"}
                  </span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Security Forfeited:</span>{" "}
                  <span className="text-red-400">
                    Rs. {customer.forfeitAmount?.toLocaleString() || "0"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(customer.id);
            setShowDeleteModal(false);
          }}
          title="Delete Previous Customer Record"
          message={`Are you sure you want to delete the record of ${customer.tenantName}? This action cannot be undone and will remove all associated data including agreement documents.`}
          itemName={`${customer.tenantName} - ${customer.unitNo}`}
        />
      )}
    </>
  );
}

// Previous Customers Section
function PreviousCustomers({ previousCustomers = [], onDelete }) {
  const [showAll, setShowAll] = useState(false);

  if (previousCustomers.length === 0) {
    return null;
  }

  const displayCustomers = showAll ? previousCustomers : previousCustomers.slice(0, 2);

  return (
    <div id="previous-customers" className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 scroll-mt-20">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={20} className="text-indigo-400" />
          <div>
            <h2 className="text-lg font-semibold text-slate-200">
              Previous Customers ({previousCustomers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Customers who have previously rented this unit
            </p>
          </div>
        </div>
        {previousCustomers.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                View All ({previousCustomers.length})
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayCustomers.map((customer) => (
          <PreviousCustomerCard
            key={customer.id}
            customer={customer}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function UnitDetailsPage() {
  const params = useParams();
  const { buildings, setBuildings } = useBuildings();
  const [building, setBuilding] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

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

  // ✅ FIX: Filter out current tenant from clearanceHistory
  const previousCustomers = unit?.clearanceHistory
    ?.filter((record) => record.tenantName !== unit?.tenant?.name)
    ?.map((record) => ({
      id: record.id,
      tenantName: record.tenantName || "Unknown Customer",
      tenantCnic: record.tenantCnic || "N/A",
      tenantPhone: record.tenantPhone || "N/A",
      tenantReference: record.tenantReference || "",
      tenantImage: record.tenantImage || null,
      agreement: record.agreement || [],
      unitNo: unit?.unitNo || "",
      type: unit?.type || "",
      monthlyRent: record.monthlyRent || 0,
      securityHeld: record.securityHeld || 0,
      returnAmount: record.returnAmount || 0,
      forfeitAmount: record.forfeitAmount || 0,
      remarks: record.remarks || "",
      clearedAt: record.clearedAt || new Date().toISOString(),
    })) || [];

  const handleDeletePreviousCustomer = (recordId) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((b) => {
        if (b.id !== building.id) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== unit.id) return r;
            return {
              ...r,
              clearanceHistory: r.clearanceHistory?.filter(
                (record) => record.id !== recordId
              ) || [],
            };
          }),
        };
      })
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading unit details...</div>
      </div>
    );
  }

  if (!building || !unit) {
    notFound();
  }

  const isRented = unit.status === "Rented" && unit.tenant !== null && unit.initialPayment !== null;
  const tenant = isRented ? unit.tenant : null;
  const initialPayment = isRented ? unit.initialPayment : null;

  return (
    <>
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

        {/* Previous Customers Section */}
        <PreviousCustomers
          previousCustomers={previousCustomers}
          onDelete={handleDeletePreviousCustomer}
        />

        {/* Quick Actions */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {isRented && (
              <>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  <Wallet size={16} />
                  Pay Rent
                </button>
                <button
                  onClick={() => setShowClearModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500"
                >
                  <UserMinus size={16} />
                  Clear Rental
                </button>
              </>
            )}
            <Link
              href={`/dashboard/buildings/${building.id}/rooms/${unit.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <Pencil size={16} />
              Edit Unit
            </Link>

            {/* Previous Records Button - Always visible if records exist */}
            {previousCustomers.length > 0 && (
              <button
                onClick={() => {
                  const element = document.getElementById('previous-customers');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                <History size={16} />
                View Previous Records ({previousCustomers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pay Rent Modal */}
      {showPayModal && (
        <PayRentModal
          buildingId={building.id}
          room={unit}
          onClose={() => setShowPayModal(false)}
        />
      )}

      {/* Clear Rental Modal */}
      {showClearModal && (
        <ClearRentalModal
          buildingId={building.id}
          room={unit}
          onClose={() => setShowClearModal(false)}
        />
      )}
    </>
  );
}