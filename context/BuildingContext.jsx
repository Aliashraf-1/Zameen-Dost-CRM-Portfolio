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

  const payRent = (buildingId, unitId, months) => {
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

            /*
             * Find pending months starting from
             * the month after the last recorded payment.
             */

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
                id:
                  Date.now() +
                  i,

                month: `${year}-${month}`,

                amount: monthlyRent,

                status: "Paid",

                paidAt: paymentDateTime,
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

  const clearRental = (
    buildingId,
    unitId,
    settlement
  ) => {
    const {
      returnAmount = 0,
      forfeitAmount = 0,
    } = settlement;

    const paymentDateTime =
      new Date().toISOString();

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
              room.initialPayment
                ?.securityReceived || 0
            );

            const returned = Number(
              returnAmount || 0
            );

            const forfeited = Number(
              forfeitAmount || 0
            );

            if (
              returned + forfeited !==
              securityHeld
            ) {
              throw new Error(
                "Security settlement amount must equal the security held."
              );
            }

            rentalRecord = {
              type: "rental-cleared",

              buildingId,

              unitId,

              unitNo: room.unitNo,

              tenantName:
                room.tenant?.name,

              securityHeld,

              returned,

              forfeited,

              clearedAt:
                paymentDateTime,
            };

            const previousSecurityHistory =
              room.securityHistory || [];

            return {
              ...room,

              status: "Available",

              purpose: null,

              rentStartDate: null,

              tenant: null,

              initialPayment: null,

              securityHistory: [
                ...previousSecurityHistory,

                ...(returned > 0
                  ? [
                      {
                        id:
                          Date.now(),

                        type: "returned",

                        amount: returned,

                        date:
                          paymentDateTime,

                        note:
                          "Security returned after rental ended.",
                      },
                    ]
                  : []),

                ...(forfeited > 0
                  ? [
                      {
                        id:
                          Date.now() + 1,

                        type: "forfeited",

                        amount: forfeited,

                        date:
                          paymentDateTime,

                        note:
                          "Security forfeited after rental ended.",
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
   * RESET DEMO DATA
   * ----------------------------------------
   */

  const resetBuildings = () => {
    setBuildings(initialBuildings);

    localStorage.removeItem(
      STORAGE_KEY
    );
  };

  const value = useMemo(
    () => ({
      buildings,
      setBuildings,
      payRent,
      clearRental,
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
  const context =
    useContext(BuildingContext);

  if (!context) {
    throw new Error(
      "useBuildings must be used inside BuildingProvider"
    );
  }

  return context;
}