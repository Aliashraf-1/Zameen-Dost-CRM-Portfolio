"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DoorOpen,
  User,
  Wallet,
  CalendarDays,
  Upload,
  FileText,
  Save,
  X,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

export default function UnitForm({
  initialData = null,
  mode = "create",
  buildingId,
  onCancel, // ✅ New prop for cancel
  onSubmit, // ✅ New prop for submit
}) {
  const isEdit = mode === "edit";

  const existingUnitNo = initialData?.unitNo || "";

  const existingDeskNo =
    initialData?.deskNo ||
    (existingUnitNo.includes("-D")
      ? existingUnitNo.split("-D")[1]
      : "");

  const baseUnitNo =
    existingUnitNo.includes("-D")
      ? existingUnitNo.split("-D")[0]
      : existingUnitNo;

  const [form, setForm] = useState({
    unitNo: baseUnitNo,

    deskNo: existingDeskNo,

    type: initialData?.type || "Room",

    reference: initialData?.reference || "",

    monthlyRent:
      initialData?.monthlyRent ?? 999,

    purpose:
      initialData?.purpose || "Room",

    status:
      initialData?.status || "Available",

    rentStartDate:
      initialData?.rentStartDate || "",

    unitImage:
      initialData?.unitImage || null,

    tenant: {
      name: initialData?.tenant?.name || "",
      cnic: initialData?.tenant?.cnic || "",
      phone: initialData?.tenant?.phone || "",
      reference:
        initialData?.tenant?.reference || "",
      image:
        initialData?.tenant?.image || null,
      agreement:
        initialData?.tenant?.agreement || [],
    },

    cashReceived:
      initialData?.initialPayment?.cashReceived ?? "",
  });

  const [loading, setLoading] = useState(false);

  const [unitImagePreview, setUnitImagePreview] =
    useState(initialData?.unitImage || null);

  const [customerImagePreview, setCustomerImagePreview] =
    useState(initialData?.tenant?.image || null);

  const [agreementFiles, setAgreementFiles] =
    useState(
      initialData?.tenant?.agreement || []
    );

  /*
   * ----------------------------------------------------
   * BASIC CHANGE
   * ----------------------------------------------------
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ----------------------------------------------------
   * PURPOSE CHANGE
   * ----------------------------------------------------
   */

  const handlePurposeChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      purpose: value,

      // Desk nahi hai to desk number ki zarurat nahi
      deskNo:
        value === "Desk"
          ? prev.deskNo
          : "",
    }));
  };

  /*
   * ----------------------------------------------------
   * TENANT CHANGE
   * ----------------------------------------------------
   */

  const handleTenantChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      tenant: {
        ...prev.tenant,
        [name]: value,
      },
    }));
  };

  /*
   * ----------------------------------------------------
   * UNIT IMAGE
   * ----------------------------------------------------
   */

  const handleUnitImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setUnitImagePreview(preview);

    setForm((prev) => ({
      ...prev,
      unitImage: file,
    }));

    e.target.value = "";
  };

  const removeUnitImage = () => {
    setUnitImagePreview(null);

    setForm((prev) => ({
      ...prev,
      unitImage: null,
    }));
  };

  /*
   * ----------------------------------------------------
   * CUSTOMER IMAGE
   * ----------------------------------------------------
   */

  const handleCustomerImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setCustomerImagePreview(preview);

    setForm((prev) => ({
      ...prev,
      tenant: {
        ...prev.tenant,
        image: file,
      },
    }));

    e.target.value = "";
  };

  const removeCustomerImage = () => {
    setCustomerImagePreview(null);

    setForm((prev) => ({
      ...prev,
      tenant: {
        ...prev.tenant,
        image: null,
      },
    }));
  };

  /*
   * ----------------------------------------------------
   * AGREEMENT / DOCUMENTS
   * MAX 5 FILES
   * ----------------------------------------------------
   */

  const handleAgreementFiles = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    const remainingSlots =
      5 - agreementFiles.length;

    if (remainingSlots <= 0) {
      alert(
        "Maximum 5 agreement documents are allowed."
      );
      return;
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots
    );

    const newFiles = selectedFiles.map(
      (file) => ({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
        type: file.type,
      })
    );

    setAgreementFiles((prev) => [
      ...prev,
      ...newFiles,
    ]);

    e.target.value = "";
  };

  const removeAgreementFile = (index) => {
    setAgreementFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /*
   * ----------------------------------------------------
   * PAYMENT CALCULATION
   * ----------------------------------------------------
   *
   * Monthly rent = agreed monthly rent.
   *
   * Cash received = actual cash customer gave.
   *
   * Example:
   *
   * Monthly rent = 4000
   * Cash received = 12000
   *
   * Rent paid = 4000
   * Security = 8000
   */

  const paymentCalculation = useMemo(() => {
    const rent =
      Number(form.monthlyRent) || 0;

    const cash =
      Number(form.cashReceived) || 0;

    if (form.status !== "Rented") {
      return {
        rentPaid: 0,
        securityReceived: 0,
      };
    }

    if (cash <= 0) {
      return {
        rentPaid: 0,
        securityReceived: 0,
      };
    }

    const rentPaid = Math.min(
      cash,
      rent
    );

    const securityReceived = Math.max(
      cash - rent,
      0
    );

    return {
      rentPaid,
      securityReceived,
    };
  }, [
    form.monthlyRent,
    form.cashReceived,
    form.status,
  ]);

  /*
   * ----------------------------------------------------
   * FINAL UNIT NUMBER
   * ----------------------------------------------------
   *
   * Normal:
   * 101
   *
   * Desk:
   * 101-D03
   */

  const finalUnitNo =
    form.purpose === "Desk" &&
    form.deskNo.trim()
      ? `${form.unitNo.trim()}-D${form.deskNo
          .trim()
          .padStart(2, "0")}`
      : form.unitNo.trim();

  /*
   * ----------------------------------------------------
   * SUBMIT
   * ----------------------------------------------------
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.purpose === "Desk" &&
      !form.deskNo.trim()
    ) {
      alert("Please enter the desk number.");
      return;
    }

    setLoading(true);

    /*
     * Payment date/time automatic.
     *
     * User manually select nahi karta.
     */

    const paymentDateTime =
      form.status === "Rented" &&
      Number(form.cashReceived) > 0
        ? new Date().toISOString()
        : null;

    const unitData = {
      ...form,

      unitNo: finalUnitNo,

      deskNo:
        form.purpose === "Desk"
          ? form.deskNo.trim()
          : null,

      monthlyRent:
        Number(form.monthlyRent) || 0,

      tenant:
        form.status === "Rented"
          ? {
              ...form.tenant,

              agreement:
                agreementFiles,
            }
          : null,

      initialPayment:
        form.status === "Rented"
          ? {
              cashReceived:
                Number(
                  form.cashReceived
                ) || 0,

              rentPaid:
                paymentCalculation.rentPaid,

              securityReceived:
                paymentCalculation.securityReceived,

              securityStatus:
                paymentCalculation.securityReceived >
                0
                  ? "Held"
                  : null,

              paymentDateTime,

              /*
               * Initial payment mein
               * rent hamesha sirf 1 month.
               */
              rentMonths:
                paymentCalculation.rentPaid >
                0
                  ? 1
                  : 0,
            }
          : null,

      rentHistory:
        form.status === "Rented" &&
        paymentCalculation.rentPaid > 0
          ? [
              {
                id:
                  (initialData?.rentHistory
                    ?.length || 0) + 1,

                month:
                  form.rentStartDate?.slice(
                    0,
                    7
                  ) ||
                  new Date()
                    .toISOString()
                    .slice(0, 7),

                amount:
                  paymentCalculation.rentPaid,

                status: "Paid",

                paidAt:
                  paymentDateTime,
              },
            ]
          : initialData?.rentHistory || [],

      securityHistory:
        form.status === "Rented" &&
        paymentCalculation.securityReceived >
          0
          ? [
              {
                id:
                  (initialData
                    ?.securityHistory
                    ?.length || 0) + 1,

                type: "received",

                amount:
                  paymentCalculation.securityReceived,

                date:
                  paymentDateTime,

                note:
                  "Initial security received",
              },
            ]
          : initialData?.securityHistory || [],
    };

    console.log(
      "FINAL UNIT DATA:",
      unitData
    );

    // ✅ If onSubmit prop is provided, call it
    if (onSubmit) {
      await onSubmit(unitData);
    } else {
      // Fallback: Just wait and log
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );
    }

    setLoading(false);
  };

  // ✅ Handle cancel - call onCancel if provided
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <DoorOpen size={22} />
          </div>

          <div>
            <h2 className="font-semibold">
              {isEdit
                ? "Edit Unit"
                : "Add New Unit"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage unit and rental
              information.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          UNIT INFORMATION
      ================================================== */}

      <div className="border-b border-slate-800 p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold">
            Unit Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about this
            unit.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Unit Number */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Unit Number
            </label>

            <input
              name="unitNo"
              value={form.unitNo}
              onChange={handleChange}
              placeholder="e.g. 104"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />

            {form.purpose === "Desk" &&
              form.deskNo && (
                <p className="mt-2 text-xs text-indigo-400">
                  Final Unit No:{" "}
                  {finalUnitNo}
                </p>
              )}
          </div>

          {/* Unit Type */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Unit Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="Room">
                Room
              </option>

              <option value="Hall">
                Hall
              </option>

              <option value="Office">
                Office
              </option>

              <option value="Shop">
                Shop
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Unit Reference */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Unit Reference
            </label>

            <input
              name="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. Balcony k sath wala"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          {/* Purpose */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Purpose
            </label>

            <select
              name="purpose"
              value={form.purpose}
              onChange={handlePurposeChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="Room">
                Room
              </option>

              <option value="Office">
                Office
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="Shop">
                Shop
              </option>

              <option value="Storage">
                Storage
              </option>

              <option value="Desk">
                Desk
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Desk Number */}

          {form.purpose === "Desk" && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Desk Number
              </label>

              <input
                name="deskNo"
                value={form.deskNo}
                onChange={handleChange}
                placeholder="e.g. 03"
                required
                className="w-full rounded-xl border border-indigo-500/40 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />

              <p className="mt-2 text-xs text-slate-600">
                Example: Unit 101 + Desk 03
                will be saved as 101-D03.
              </p>
            </div>
          )}

          {/* Monthly Rent */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Monthly Rent
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                Rs.
              </span>

              <input
                type="number"
                min="0"
                name="monthlyRent"
                value={form.monthlyRent}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Agreed monthly rent. Ye
              initial payment nahi hai.
            </p>
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Unit Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="Available">
                Available
              </option>

              <option value="Rented">
                Rented
              </option>
            </select>
          </div>
        </div>

        {/* Unit Image */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Unit Picture
            <span className="ml-2 text-xs font-normal text-slate-600">
              Optional
            </span>
          </label>

          {unitImagePreview ? (
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <img
                src={unitImagePreview}
                alt="Unit preview"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={removeUnitImage}
                className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-10 text-center transition hover:border-indigo-500 hover:bg-indigo-500/5">
              <ImageIcon
                size={28}
                className="text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-400">
                Upload unit picture
              </p>

              <p className="mt-1 text-xs text-slate-600">
                JPG, PNG or WEBP
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleUnitImage}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* ==================================================
          RENTAL INFORMATION
      ================================================== */}

      {form.status === "Rented" && (
        <>
          {/* CUSTOMER */}

          <div className="border-b border-slate-800 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <User size={20} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Customer Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Information about the
                  person renting this unit.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Customer Name
                </label>

                <input
                  name="name"
                  value={form.tenant.name}
                  onChange={handleTenantChange}
                  placeholder="Enter customer name"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              {/* CNIC */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  CNIC
                </label>

                <input
                  name="cnic"
                  value={form.tenant.cnic}
                  onChange={handleTenantChange}
                  placeholder="37405-1234567-1"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.tenant.phone}
                  onChange={handleTenantChange}
                  placeholder="0300-1234567"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              {/* Reference */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Customer Reference
                </label>

                <input
                  name="reference"
                  value={form.tenant.reference}
                  onChange={handleTenantChange}
                  placeholder="e.g. Software wala bacha"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* CUSTOMER IMAGE */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Customer Picture
                <span className="ml-2 text-xs font-normal text-slate-600">
                  Optional
                </span>
              </label>

              {customerImagePreview ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                  <img
                    src={customerImagePreview}
                    alt="Customer"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={
                      removeCustomerImage
                    }
                    className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 transition hover:border-indigo-500 hover:bg-indigo-500/5">
                  <User
                    size={28}
                    className="text-slate-600"
                  />

                  <span className="mt-2 text-xs text-slate-500">
                    Upload Picture
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleCustomerImage
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* AGREEMENT */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                  Agreement / Documents
                </label>

                <span className="text-xs text-slate-600">
                  {agreementFiles.length}/5
                  files
                </span>
              </div>

              <label
                className={`flex items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-5 transition ${
                  agreementFiles.length >=
                  5
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5"
                }`}
              >
                <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
                  <Upload size={18} />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Add agreement documents
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Maximum 5 files
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  disabled={
                    agreementFiles.length >=
                    5
                  }
                  onChange={
                    handleAgreementFiles
                  }
                  className="hidden"
                />
              </label>

              {agreementFiles.length >
                0 && (
                <div className="mt-4 space-y-2">
                  {agreementFiles.map(
                    (file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                            <FileText
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm text-slate-300">
                              {file.name}
                            </p>

                            <p className="text-xs text-slate-600">
                              Document{" "}
                              {index + 1}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeAgreementFile(
                              index
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              RENTAL & PAYMENT
          ================================================== */}

          <div className="border-b border-slate-800 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <Wallet size={20} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Rental & Initial Payment
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Record the actual cash
                  received from the customer.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* RENT START DATE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Rent Starting Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="date"
                    name="rentStartDate"
                    value={
                      form.rentStartDate
                    }
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  Rent agreement ki starting
                  date.
                </p>
              </div>

              {/* CASH RECEIVED */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Rent & Security Received
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    name="cashReceived"
                    value={
                      form.cashReceived
                    }
                    onChange={handleChange}
                    placeholder="e.g. 12000"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  Customer ne actual cash
                  kitna diya.
                </p>
              </div>
            </div>

            {/* CALCULATION */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* RENT */}

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Current Month Rent
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  Rs.{" "}
                  {paymentCalculation.rentPaid.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  One month rent
                  automatically paid
                </p>
              </div>

              {/* SECURITY */}

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs text-slate-500">
                  Security Received
                </p>

                <p className="mt-2 text-xl font-bold text-emerald-400">
                  Rs.{" "}
                  {paymentCalculation.securityReceived.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Held as refundable security
                </p>
              </div>
            </div>

            {/* EXPLANATION */}

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs leading-5 text-slate-500">
                Monthly rent hamesha sirf
                aik month ka hoga. Customer
                ke diye huay additional paisay
                automatically security mein
                chale jayenge. Payment ki exact
                date aur time system khud save
                karega. Rent starting date
                agreement ki date hogi.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ==================================================
          FOOTER - UPDATED with onCancel support
      ================================================== */}

      <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
        {/* ✅ Cancel Button - Uses onCancel if provided, otherwise Link */}
        {onCancel ? (
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={17} />
            Cancel
          </button>
        ) : (
          <Link
            href={`/dashboard/buildings/${buildingId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={17} />
            Cancel
          </Link>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />

          {loading
            ? "Saving..."
            : isEdit
            ? "Update Unit"
            : "Save Unit"}
        </button>
      </div>
    </form>
  );
}