// data/index.js
export { buildings } from "./buildings";
export { employees } from "./employees";
export { sidebarItems } from "./sidebar";

// Helper function to get data by ID
export const getBuildingById = (id) => {
  return buildings.find((b) => b.id === id);
};

export const getEmployeeById = (id) => {
  return employees.find((e) => e.id === id);
};

export const getRoomById = (buildingId, roomId) => {
  const building = getBuildingById(buildingId);
  if (!building) return null;
  return building.rooms?.find((r) => r.id === roomId) || null;
};

// Helper function to get all customers
export const getAllCustomers = () => {
  const customers = [];
  buildings.forEach((building) => {
    building.rooms?.forEach((room) => {
      if (room.status === "Rented" && room.tenant) {
        customers.push({
          ...room.tenant,
          buildingId: building.id,
          buildingNo: building.buildingNo,
          unitId: room.id,
          unitNo: room.unitNo,
          monthlyRent: room.monthlyRent,
          rentStartDate: room.rentStartDate,
          security: room.initialPayment?.securityReceived || 0,
          rentHistory: room.rentHistory || [],
          securityHistory: room.securityHistory || [],
        });
      }
    });
  });
  return customers;
};

// Helper function to get revenue data
export const getRevenueData = () => {
  let totalRevenue = 0;
  let totalExpenses = 0;
  const transactions = [];

  // Income from rent
  buildings.forEach((building) => {
    building.rooms?.forEach((room) => {
      room.rentHistory?.forEach((rent) => {
        if (rent.status === "Paid") {
          totalRevenue += rent.amount;
          transactions.push({
            id: `rent-${rent.id}`,
            type: "Income",
            category: "Rent",
            description: `Rent from ${room.tenant?.name || "Unknown"} - ${building.buildingNo} ${room.unitNo}`,
            amount: rent.amount,
            status: "Received",
            date: rent.paidAt,
            buildingId: building.id,
            unitId: room.id,
          });
        }
      });
    });
  });

  // Expenses from salaries
  employees.forEach((emp) => {
    emp.salaryHistory?.forEach((salary) => {
      if (salary.status === "Paid") {
        totalExpenses += salary.amount;
        transactions.push({
          id: `salary-${salary.id}`,
          type: "Expense",
          category: "Salary",
          description: `Salary payment to ${emp.name}`,
          amount: salary.amount,
          status: "Paid",
          date: salary.paidAt,
          employeeId: emp.id,
        });
      }
    });
  });

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    transactions,
  };
};