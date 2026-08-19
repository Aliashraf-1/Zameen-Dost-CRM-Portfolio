export function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

export function getCustomerRentStatus(room) {
  if (!room?.tenant || room.status !== "Rented") {
    return {
      status: "Inactive",
      pendingMonths: 0,
      outstanding: 0,
      lastPaidAt: null,
    };
  }

  const history = room.rentHistory || [];

  const currentMonth = getCurrentMonth();

  const currentMonthPayment = history.find(
    (item) =>
      item.month === currentMonth &&
      item.status === "Paid"
  );

  const lastPaidPayment = [...history]
    .filter((item) => item.status === "Paid")
    .sort(
      (a, b) =>
        new Date(b.paidAt) -
        new Date(a.paidAt)
    )[0];

  const startDate = room.rentStartDate
    ? new Date(room.rentStartDate)
    : new Date();

  const now = new Date();

  let monthsExpected =
    (now.getFullYear() - startDate.getFullYear()) *
      12 +
    (now.getMonth() - startDate.getMonth()) +
    1;

  if (monthsExpected < 1) {
    monthsExpected = 1;
  }

  const paidMonths = history.filter(
    (item) => item.status === "Paid"
  ).length;

  const pendingMonths = Math.max(
    monthsExpected - paidMonths,
    0
  );

  const outstanding =
    pendingMonths *
    Number(room.monthlyRent || 0);

  let status = "Paid";

  if (pendingMonths >= 2) {
    status = "Overdue";
  } else if (pendingMonths === 1) {
    status = "Pending";
  }

  return {
    status,
    pendingMonths,
    outstanding,
    lastPaidAt:
      lastPaidPayment?.paidAt || null,
  };
}

export function getCustomersFromBuildings(buildings) {
  const customers = [];

  buildings.forEach((building) => {
    (building.rooms || []).forEach((room) => {
      if (
        room.status !== "Rented" ||
        !room.tenant
      ) {
        return;
      }

      const rentStatus =
        getCustomerRentStatus(room);

      customers.push({
        id: `${building.id}-${room.id}`,

        name: room.tenant.name || "Not Set",

        cnic: room.tenant.cnic || "Not Set",

        phone: room.tenant.phone || "Not Set",

        image: room.tenant.image || null,

        reference:
          room.tenant.reference || "Not Set",

        buildingId: building.id,

        buildingNo:
          building.buildingNo,

        buildingReference:
          building.reference,

        unitId: room.id,

        unitNo: room.unitNo,

        unitType: room.type,

        purpose:
          room.purpose || "Not Set",

        monthlyRent:
          Number(room.monthlyRent || 0),

        rentStartDate:
          room.rentStartDate || null,

        security:
          Number(
            room.initialPayment
              ?.securityReceived || 0
          ),

        securityStatus:
          room.initialPayment
            ?.securityStatus || "None",

        rentHistory:
          room.rentHistory || [],

        securityHistory:
          room.securityHistory || [],

        ...rentStatus,
      });
    });
  });

  return customers;
}