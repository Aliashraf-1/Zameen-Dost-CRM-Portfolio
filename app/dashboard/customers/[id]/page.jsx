import { notFound } from "next/navigation";

import { buildings } from "@/data/buildings";

import {
  getCustomersFromBuildings,
} from "@/lib/customerUtils";

import CustomerDetails from "@/components/customers/CustomerDetails";

export default async function CustomerDetailsPage({
  params,
}) {
  const { id } = await params;

  const customers =
    getCustomersFromBuildings(
      buildings
    );

  const customer = customers.find(
    (item) => item.id === id
  );

  if (!customer) {
    notFound();
  }

  return (
    <CustomerDetails
      customer={customer}
    />
  );
}