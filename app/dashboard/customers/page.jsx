import {
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { buildings } from "@/data/buildings";

import CustomerSummary from "@/components/customers/CustomerSummary";
import CustomerTable from "@/components/customers/CustomerTable";

import {
  getCustomersFromBuildings,
} from "@/lib/customerUtils";

export default function CustomersPage() {
  const customers =
    getCustomersFromBuildings(
      buildings
    );

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            View tenants, rental units, rent
            status and security information
            from one place.
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <UserPlus size={17} />
          Add Customer
        </Link>
      </div>

      {/* Summary */}
      <CustomerSummary
        customers={customers}
      />

      {/* Table */}
      <div className="mt-6">
        <CustomerTable
          customers={customers}
        />
      </div>
    </div>
  );
}