"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildings as initialBuildings } from "@/data/buildings";

const BuildingContext = createContext(null);

const STORAGE_KEY = "bms-buildings";

function getInitialData() {
  if (typeof window === "undefined") {
    return initialBuildings;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load building data:", error);
  }

  return initialBuildings;
}

export function BuildingProvider({ children }) {
  const [buildings, setBuildings] = useState(getInitialData);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(buildings)
    );
  }, [buildings]);

  /*
   * ----------------------------------------
   * PAY RENT
   * ----------------------------------------
   */

  const payRent = (buildingId, unitId, months, remarks = "") => {
    const numberOfMonths = Number(months);

    if (!numberOfMonths || numberOfMonths < 1) {
      throw new Error("Invalid number of months.");
    }

    const paymentDateTime = new Date().toISOString();

    let paymentRecord = null;

    setBuildings((prevBuildings) =>
      prevBuildings.map((building) => {
        if (building.id !== buildingId) {
          return building;
        }

        return {
          ...building,

          rooms: building.rooms.map((room) => {
            if (room.id !== unitId) {
              return room;
            }

            const monthlyRent = Number(room.monthlyRent || 0);

            const amount = monthlyRent * numberOfMonths;

            const existingHistory = room.rentHistory || [];

            const newHistory = [];

            let nextDate = new Date(
              room.rentStartDate || paymentDateTime
            );

            if (existingHistory.length > 0) {
              const lastPayment =
                existingHistory[existingHistory.length - 1];

              nextDate = new Date(
                `${lastPayment.month}-01T00:00:00`
              );

              nextDate.setMonth(
                nextDate.getMonth() + 1
              );
            }

            for (
              let i = 0;
              i < numberOfMonths;
              i++
            ) {
              const year = nextDate.getFullYear();

              const month = String(
                nextDate.getMonth() + 1
              ).padStart(2, "0");

              newHistory.push({
                id: Date.now() + i,
                month: `${year}-${month}`,
                amount: monthlyRent,
                status: "Paid",
                paidAt: paymentDateTime,
                remarks: remarks || "Monthly rent payment",
              });

              nextDate.setMonth(
                nextDate.getMonth() + 1
              );
            }

            paymentRecord = {
              type: "rent",
              buildingId,
              unitId,
              unitNo: room.unitNo,
              tenantName: room.tenant?.name,
              amount,
              months: numberOfMonths,
              paidAt: paymentDateTime,
              remarks: remarks || "Monthly rent payment",
            };

            return {
              ...room,

              rentHistory: [
                ...existingHistory,
                ...newHistory,
              ],

              lastRentPayment: {
                amount,
                months: numberOfMonths,
                paidAt: paymentDateTime,
                remarks: remarks || "Monthly rent payment",
              },
            };
          }),
        };
      })
    );

    return paymentRecord;
  };

  /*
   * ----------------------------------------
   * CLEAR RENTAL
   * ----------------------------------------
   */

 const clearRental = (buildingId, unitId, settlement) => {
  const {
    returnAmount = 0,
    forfeitAmount = 0,
    remarks = "",
    clearedAt = new Date().toISOString(),
  } = settlement;

  let rentalRecord = null;

  setBuildings((prevBuildings) =>
    prevBuildings.map((building) => {
      if (building.id !== buildingId) {
        return building;
      }

      return {
        ...building,

        rooms: building.rooms.map((room) => {
          if (room.id !== unitId) {
            return room;
          }

          const securityHeld = Number(
            room.initialPayment?.securityReceived || 0
          );

          const returned = Number(returnAmount || 0);
          const forfeited = Number(forfeitAmount || 0);

          if (returned + forfeited !== securityHeld) {
            throw new Error(
              "Security settlement amount must equal the security held."
            );
          }

          const previousSecurityHistory = room.securityHistory || [];
          const previousClearanceHistory = room.clearanceHistory || [];

          // ✅ Store complete tenant data for history
          const tenantData = room.tenant ? {
            name: room.tenant.name || "Unknown",
            cnic: room.tenant.cnic || "N/A",
            phone: room.tenant.phone || "N/A",
            reference: room.tenant.reference || "",
            image: room.tenant.image || null,
            agreement: room.tenant.agreement || [],
          } : null;

          rentalRecord = {
            type: "rental-cleared",
            buildingId,
            unitId,
            unitNo: room.unitNo,
            tenantName: tenantData?.name || "Unknown",
            tenantCnic: tenantData?.cnic || "N/A",
            tenantPhone: tenantData?.phone || "N/A",
            tenantReference: tenantData?.reference || "",
            tenantImage: tenantData?.image || null,
            agreement: tenantData?.agreement || [],
            monthlyRent: room.monthlyRent || 0,
            securityHeld,
            returned,
            forfeited,
            remarks: remarks || "Rental cleared",
            clearedAt,
          };

          return {
            ...room,
            // ✅ Clear all tenant related data
            status: "Available",
            purpose: null,
            rentStartDate: null,
            tenant: null,        // ✅ Important: tenant null karo
            initialPayment: null, // ✅ Important: initialPayment null karo
            unitImage: room.unitImage || null,
            deskNo: room.deskNo || null,
            
            // ✅ Add to clearance history
            clearanceHistory: [
              ...previousClearanceHistory,
              {
                id: Date.now(),
                type: "Rental Clearance",
                tenantName: rentalRecord.tenantName,
                tenantCnic: rentalRecord.tenantCnic,
                tenantPhone: rentalRecord.tenantPhone,
                tenantReference: rentalRecord.tenantReference,
                tenantImage: rentalRecord.tenantImage,
                agreement: rentalRecord.agreement,
                monthlyRent: rentalRecord.monthlyRent,
                securityHeld: rentalRecord.securityHeld,
                returnAmount: rentalRecord.returned,
                forfeitAmount: rentalRecord.forfeited,
                remarks: rentalRecord.remarks,
                clearedAt: rentalRecord.clearedAt,
              },
            ],

            // ✅ Update security history
            securityHistory: [
              ...previousSecurityHistory,
              ...(returned > 0
                ? [
                    {
                      id: Date.now(),
                      type: "returned",
                      amount: returned,
                      date: clearedAt,
                      note: `Security returned to customer. ${remarks || "Rental ended"}`,
                    },
                  ]
                : []),
              ...(forfeited > 0
                ? [
                    {
                      id: Date.now() + 1,
                      type: "forfeited",
                      amount: forfeited,
                      date: clearedAt,
                      note: `Security forfeited. ${remarks || "Rental ended"}`,
                    },
                  ]
                : []),
            ],

            // ✅ Update transaction history
            transactionHistory: [
              ...(room.transactionHistory || []),
              ...(returned > 0
                ? [
                    {
                      id: `clear-return-${Date.now()}`,
                      type: "Security Returned",
                      category: "Security Refund",
                      amount: returned,
                      description: `Security returned to ${room.tenant?.name || "Unknown"} - Unit ${room.unitNo}`,
                      status: "Completed",
                      paidAt: clearedAt,
                      remarks: remarks || "Security returned after rental ended",
                    },
                  ]
                : []),
              ...(forfeited > 0
                ? [
                    {
                      id: `clear-forfeit-${Date.now()}`,
                      type: "Security Forfeited",
                      category: "Security Income",
                      amount: forfeited,
                      description: `Security forfeited from ${room.tenant?.name || "Unknown"} - Unit ${room.unitNo}`,
                      status: "Received",
                      receivedAt: clearedAt,
                      remarks: remarks || "Security forfeited after rental ended",
                    },
                  ]
                : []),
            ],
          };
        }),
      };
    })
  );

  return rentalRecord;
};

  /*
   * ----------------------------------------
   * GET UNIT TRANSACTIONS
   * ----------------------------------------
   */

  const getUnitTransactions = (buildingId, unitId) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return [];

    const room = building.rooms?.find((r) => r.id === unitId);
    if (!room) return [];

    return room.transactionHistory || [];
  };

  /*
   * ----------------------------------------
   * RESET DEMO DATA
   * ----------------------------------------
   */

  const resetBuildings = () => {
    setBuildings(initialBuildings);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      buildings,
      setBuildings,
      payRent,
      clearRental,
      getUnitTransactions,
      resetBuildings,
    }),
    [buildings]
  );

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuildings() {
  const context = useContext(BuildingContext);

  if (!context) {
    throw new Error(
      "useBuildings must be used inside BuildingProvider"
    );
  }

  return context;
}