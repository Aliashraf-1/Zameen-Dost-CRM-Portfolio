"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  FilePlus,
  Eye,
} from "lucide-react";
import { useBuildings } from "@/context/BuildingContext";
import DocumentTemplates from "./DocumentTemplates";
import DocumentEditor from "./DocumentEditor";
import { documentTemplates } from "@/data/documentTemplates";

export default function UnitForm({
  initialData = null,
  mode = "create",
  buildingId,
  onCancel,
  onSubmit,
}) {
  const router = useRouter();
  const { addRoom, updateRoom } = useBuildings();
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
    monthlyRent: initialData?.monthlyRent ?? 999,
    purpose: initialData?.purpose || "Room",
    status: initialData?.status || "Available",
    rentStartDate: initialData?.rentStartDate || "",
    unitImage: initialData?.unitImage || null,
    tenant: {
      name: initialData?.tenant?.name || "",
      cnic: initialData?.tenant?.cnic || "",
      phone: initialData?.tenant?.phone || "",
      reference: initialData?.tenant?.reference || "",
      image: initialData?.tenant?.image || null,
      agreement: initialData?.tenant?.agreement || [],
      documents: initialData?.tenant?.documents || [],
    },
    cashReceived: initialData?.initialPayment?.cashReceived ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [unitImagePreview, setUnitImagePreview] = useState(initialData?.unitImage || null);
  const [customerImagePreview, setCustomerImagePreview] = useState(initialData?.tenant?.image || null);
  const [agreementFiles, setAgreementFiles] = useState(initialData?.tenant?.agreement || []);
  const [savedDocuments, setSavedDocuments] = useState(initialData?.tenant?.documents || []);
  
  // Document Editor State
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);

  // Basic Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      purpose: value,
      deskNo: value === "Desk" ? prev.deskNo : "",
    }));
  };

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

  // Image Handlers
  const handleUnitImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUnitImagePreview(preview);
    setForm((prev) => ({ ...prev, unitImage: file }));
    e.target.value = "";
  };

  const removeUnitImage = () => {
    setUnitImagePreview(null);
    setForm((prev) => ({ ...prev, unitImage: null }));
  };

  const handleCustomerImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCustomerImagePreview(preview);
    setForm((prev) => ({
      ...prev,
      tenant: { ...prev.tenant, image: file },
    }));
    e.target.value = "";
  };

  const removeCustomerImage = () => {
    setCustomerImagePreview(null);
    setForm((prev) => ({
      ...prev,
      tenant: { ...prev.tenant, image: null },
    }));
  };

  // Agreement Files (MAX 5)
  const handleAgreementFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - agreementFiles.length;
    if (remainingSlots <= 0) {
      alert("Maximum 5 agreement documents are allowed.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const newFiles = selectedFiles.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      type: file.type,
    }));

    setAgreementFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeAgreementFile = (index) => {
    setAgreementFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Document Templates
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setEditingDocument(null);
    setShowDocumentEditor(true);
  };

  const handleViewExistingDocument = (template) => {
    const existing = savedDocuments.find(doc => doc.templateId === template.id);
    if (existing) {
      setEditingDocument(existing);
      setSelectedTemplate(template);
      setShowDocumentEditor(true);
    }
  };

  const handleSaveDocument = (documentData) => {
    const existingIndex = savedDocuments.findIndex(doc => doc.id === documentData.id);
    
    if (existingIndex !== -1) {
      const updatedDocs = [...savedDocuments];
      updatedDocs[existingIndex] = documentData;
      setSavedDocuments(updatedDocs);
    } else {
      setSavedDocuments([...savedDocuments, documentData]);
    }
  };

  // Payment Calculation
  const paymentCalculation = useMemo(() => {
    const rent = Number(form.monthlyRent) || 0;
    const cash = Number(form.cashReceived) || 0;

    if (form.status !== "Rented") {
      return { rentPaid: 0, securityReceived: 0 };
    }

    if (cash <= 0) {
      return { rentPaid: 0, securityReceived: 0 };
    }

    const rentPaid = Math.min(cash, rent);
    const securityReceived = Math.max(cash - rent, 0);

    return { rentPaid, securityReceived };
  }, [form.monthlyRent, form.cashReceived, form.status]);

  const finalUnitNo =
    form.purpose === "Desk" && form.deskNo.trim()
      ? `${form.unitNo.trim()}-D${form.deskNo.trim().padStart(2, "0")}`
      : form.unitNo.trim();

  // ✅ SUBMIT - Complete Working Version
 // ✅ SUBMIT - Complete Working Version with Image Preservation
const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.purpose === "Desk" && !form.deskNo.trim()) {
    alert("Please enter the desk number.");
    return;
  }

  setLoading(true);

  const paymentDateTime =
    form.status === "Rented" && Number(form.cashReceived) > 0
      ? new Date().toISOString()
      : null;

  // ✅ Prepare safe agreement data (without File objects)
  const safeAgreement = agreementFiles.map((f) => ({
    name: f.name,
    url: null,
  }));

  // ✅ Prepare tenant data
  let tenantData = null;
  if (form.status === "Rented") {
    tenantData = {
      name: form.tenant.name || "",
      cnic: form.tenant.cnic || "",
      phone: form.tenant.phone || "",
      reference: form.tenant.reference || "",
      image: null, // Will be set later
      agreement: safeAgreement,
      documents: savedDocuments,
    };
  }

  // ✅ Prepare unitData
  const unitData = {
    unitNo: finalUnitNo,
    deskNo: form.purpose === "Desk" ? form.deskNo.trim() : null,
    type: form.type,
    reference: form.reference,
    monthlyRent: Number(form.monthlyRent) || 0,
    purpose: form.purpose,
    status: form.status,
    rentStartDate: form.rentStartDate || null,
    unitImage: null, // Will be set later
    tenant: tenantData,
    initialPayment: form.status === "Rented" && paymentCalculation.rentPaid > 0 ? {
      cashReceived: Number(form.cashReceived) || 0,
      rentPaid: paymentCalculation.rentPaid,
      securityReceived: paymentCalculation.securityReceived,
      securityStatus: paymentCalculation.securityReceived > 0 ? "Held" : null,
      paymentDateTime,
      rentMonths: paymentCalculation.rentPaid > 0 ? 1 : 0,
    } : null,
    rentHistory: form.status === "Rented" && paymentCalculation.rentPaid > 0
      ? [
          {
            month: form.rentStartDate?.slice(0, 7) || new Date().toISOString().slice(0, 7),
            amount: paymentCalculation.rentPaid,
            status: "Paid",
            paidAt: paymentDateTime,
          },
        ]
      : [],
    securityHistory: form.status === "Rented" && paymentCalculation.securityReceived > 0
      ? [
          {
            type: "received",
            amount: paymentCalculation.securityReceived,
            date: paymentDateTime,
            note: "Initial security received",
          },
        ]
      : [],
  };

  // ✅ For edit mode, preserve existing data
  if (isEdit && initialData) {
    // ✅ PRESERVE IMAGES if not uploading new ones
    if (!form.unitImage || !(form.unitImage instanceof File)) {
      unitData.unitImage = initialData.unitImage || null;
    }
    if (form.status === "Rented" && initialData.tenant) {
      if (!form.tenant.image || !(form.tenant.image instanceof File)) {
        if (unitData.tenant) {
          unitData.tenant.image = initialData.tenant.image || null;
        }
      }
      // Preserve agreement and documents if not changed
      if (unitData.tenant) {
        if (!form.tenant.agreement || form.tenant.agreement.length === 0) {
          unitData.tenant.agreement = initialData.tenant.agreement || [];
        }
        if (!form.tenant.documents || form.tenant.documents.length === 0) {
          unitData.tenant.documents = initialData.tenant.documents || [];
        }
      }
    }
    // ✅ PRESERVE HISTORIES
    if (initialData.rentHistory) {
      unitData.rentHistory = initialData.rentHistory;
    }
    if (initialData.securityHistory) {
      unitData.securityHistory = initialData.securityHistory;
    }
    if (initialData.clearanceHistory) {
      unitData.clearanceHistory = initialData.clearanceHistory;
    }
    if (initialData.transactionHistory) {
      unitData.transactionHistory = initialData.transactionHistory;
    }
  }

  // ✅ Build FormData
  const formData = new FormData();
  formData.append('roomData', JSON.stringify(unitData));

  // ✅ Append NEW unit image ONLY IF it's a File object (new upload)
  if (form.unitImage && form.unitImage instanceof File) {
    formData.append('unitImage', form.unitImage);
  }

  // ✅ Append NEW tenant image ONLY IF it's a File object (new upload)
  if (form.tenant.image && form.tenant.image instanceof File) {
    formData.append('tenantImage', form.tenant.image);
  }

  // ✅ Append agreement files
  agreementFiles.forEach((item) => {
    if (item.file) {
      formData.append('agreementFiles', item.file);
    }
  });

  console.log("📸 FormData keys:", [...formData.keys()]);
  console.log("📦 Unit Data:", unitData);

  try {
    if (onSubmit) {
      await onSubmit(formData);
    } else {
      const buildingIdStr = String(buildingId);
      if (isEdit) {
        const roomId = initialData._id || initialData.id;
        await updateRoom(buildingIdStr, roomId, formData);
      } else {
        await addRoom(buildingIdStr, formData);
      }
      router.push(`/dashboard/buildings/${buildingIdStr}`);
    }
  } catch (error) {
    console.error("❌ Save error:", error);
    const msg = error.response?.data?.message || error.message || "Failed to save unit.";
    alert(msg);
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/dashboard/buildings/${buildingId}`);
    }
  };

  // Build form data for document editor
  const getFormDataForDocument = () => {
    return {
      customerName: form.tenant?.name || "",
      customerFatherName: form.tenant?.fatherName || "",
      customerAddress: form.tenant?.address || "",
      cnic: form.tenant?.cnic || "",
      phone: form.tenant?.phone || "",
      ownerName: "_____",
      buildingNo: `Building #${buildingId}`,
      unitNo: finalUnitNo,
      unitType: form.type,
      monthlyRent: form.monthlyRent || 0,
      security: paymentCalculation.securityReceived || 0,
      rentStartDate: form.rentStartDate || new Date().toISOString().split('T')[0],
      rentDueDate: "5",
      lateFee: "100",
      agreementDate: new Date().toISOString().split('T')[0],
      address: form.reference || "",
    };
  };

  const buildingData = {
    buildingId: buildingId,
    buildingNo: `Building #${buildingId}`,
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
      >
        {/* Header */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <DoorOpen size={22} />
            </div>
            <div>
              <h2 className="font-semibold">
                {isEdit ? "Edit Unit" : "Add New Unit"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage unit and rental information.
              </p>
            </div>
          </div>
        </div>

        {/* Unit Information */}
        <div className="border-b border-slate-800 p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold">Unit Information</h3>
            <p className="mt-1 text-sm text-slate-500">
              Basic information about this unit.
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
              {form.purpose === "Desk" && form.deskNo && (
                <p className="mt-2 text-xs text-indigo-400">
                  Final Unit No: {finalUnitNo}
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
                <option value="Room">Room</option>
                <option value="Hall">Hall</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
                <option value="Other">Other</option>
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
                <option value="Room">Room</option>
                <option value="Office">Office</option>
                <option value="Hostel">Hostel</option>
                <option value="Shop">Shop</option>
                <option value="Storage">Storage</option>
                <option value="Desk">Desk</option>
                <option value="Other">Other</option>
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
                  Example: Unit 101 + Desk 03 will be saved as 101-D03.
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
                Agreed monthly rent. Ye initial payment nahi hai.
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
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
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
                <ImageIcon size={28} className="text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">Upload unit picture</p>
                <p className="mt-1 text-xs text-slate-600">JPG, PNG or WEBP</p>
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

        {/* Rental Information */}
        {form.status === "Rented" && (
          <>
            {/* Customer */}
            <div className="border-b border-slate-800 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Information</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Information about the person renting this unit.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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

              {/* Customer Image */}
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
                      onClick={removeCustomerImage}
                      className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 transition hover:border-indigo-500 hover:bg-indigo-500/5">
                    <User size={28} className="text-slate-600" />
                    <span className="mt-2 text-xs text-slate-500">Upload Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomerImage}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Agreement Files & Document Templates */}
              <div className="mt-6">
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      Agreement Files
                    </label>
                    <span className="text-xs text-slate-600">
                      {agreementFiles.length}/5 files
                    </span>
                  </div>
                  <label
                    className={`flex items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-5 transition ${
                      agreementFiles.length >= 5
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5"
                    }`}
                  >
                    <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Add agreement documents</p>
                      <p className="mt-1 text-xs text-slate-600">Maximum 5 files</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      disabled={agreementFiles.length >= 5}
                      onChange={handleAgreementFiles}
                      className="hidden"
                    />
                  </label>
                  {agreementFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {agreementFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                              <FileText size={17} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm text-slate-300">{file.name}</p>
                              <p className="text-xs text-slate-600">Document {index + 1}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAgreementFile(index)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Document Templates Section */}
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <DocumentTemplates
                    onSelectTemplate={handleSelectTemplate}
                    onViewExisting={handleViewExistingDocument}
                    existingDocuments={savedDocuments}
                    disabled={form.status !== "Rented"}
                  />

                  {savedDocuments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-slate-500">Saved Documents</p>
                      {savedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-indigo-400" />
                            <span className="text-sm text-slate-300">{doc.title}</span>
                            <span className="text-xs text-slate-500">
                              v{doc.version || 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDocument(doc);
                                const template = documentTemplates.find(
                                  (t) => t.id === doc.templateId
                                );
                                if (template) {
                                  setSelectedTemplate(template);
                                  setShowDocumentEditor(true);
                                }
                              }}
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSavedDocuments((prev) =>
                                  prev.filter((d) => d.id !== doc.id)
                                );
                              }}
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rental & Payment */}
            <div className="border-b border-slate-800 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Rental & Initial Payment</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Record the actual cash received from the customer.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                      value={form.rentStartDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    Rent agreement ki starting date.
                  </p>
                </div>

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
                      value={form.cashReceived}
                      onChange={handleChange}
                      placeholder="e.g. 12000"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    Customer ne actual cash kitna diya.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Current Month Rent</p>
                  <p className="mt-2 text-xl font-bold text-white">
                    Rs. {paymentCalculation.rentPaid.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    One month rent automatically paid
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs text-slate-500">Security Received</p>
                  <p className="mt-2 text-xl font-bold text-emerald-400">
                    Rs. {paymentCalculation.securityReceived.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Held as refundable security
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Monthly rent hamesha sirf aik month ka hoga. Customer ke diye huay additional paisay
                  automatically security mein chale jayenge. Payment ki exact date aur time system khud save
                  karega. Rent starting date agreement ki date hogi.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
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
            {loading ? "Saving..." : isEdit ? "Update Unit" : "Save Unit"}
          </button>
        </div>
      </form>

      {/* Document Editor Modal */}
      {showDocumentEditor && selectedTemplate && (
        <DocumentEditor
          isOpen={showDocumentEditor}
          onClose={() => {
            setShowDocumentEditor(false);
            setSelectedTemplate(null);
            setEditingDocument(null);
          }}
          template={selectedTemplate}
          formData={getFormDataForDocument()}
          buildingData={buildingData}
          onSave={handleSaveDocument}
          existingDocument={editingDocument}
        />
      )}
    </>
  );
}