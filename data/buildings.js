export const buildings = [
  {
    id: 1,
    buildingNo: "Building #01",
    reference: "University Road",
    address: "University Road, Sargodha",
    totalUnits: 12,
    status: "Active",

    rooms: [
      {
        id: 101,
        unitNo: "101",
        type: "Office",
        deskNo: null,
        status: "Rented",
        purpose: "Office",
        monthlyRent: 25000,
        rentStartDate: "2026-06-01",
        unitImage: null,

        tenant: {
          name: "Muhammad Ahmed",
          cnic: "37405-1234567-1",
          phone: "0300-1234567",
          reference: "Software wala bacha",
          image: null,
          agreement: [],
        },

        initialPayment: {
          cashReceived: 105000,
          rentPaid: 25000,
          securityReceived: 80000,
          securityStatus: "Held",
          paymentDateTime: "2026-06-01T10:30:00.000Z",
          rentMonths: 1,
        },

        rentHistory: [
          {
            id: 1,
            month: "2026-06",
            amount: 25000,
            status: "Paid",
            paidAt: "2026-06-01T10:30:00.000Z",
          },
        ],

        securityHistory: [
          {
            id: 1,
            type: "received",
            amount: 80000,
            date: "2026-06-01T10:30:00.000Z",
            note: "Initial security received",
          },
        ],
      },

      {
        id: 102,
        unitNo: "102",
        type: "Room",
        deskNo: null,
        status: "Rented",
        purpose: "Hostel",
        monthlyRent: 30000,
        rentStartDate: "2026-07-15",
        unitImage: null,

        tenant: {
          name: "Ali Raza",
          cnic: "37405-7654321-1",
          phone: "0312-7654321",
          reference: "Student",
          image: null,
          agreement: [],
        },

        initialPayment: {
          cashReceived: 130000,
          rentPaid: 30000,
          securityReceived: 100000,
          securityStatus: "Held",
          paymentDateTime: "2026-07-15T11:15:00.000Z",
          rentMonths: 1,
        },

        rentHistory: [
          {
            id: 1,
            month: "2026-07",
            amount: 30000,
            status: "Paid",
            paidAt: "2026-07-15T11:15:00.000Z",
          },
        ],

        securityHistory: [
          {
            id: 1,
            type: "received",
            amount: 100000,
            date: "2026-07-15T11:15:00.000Z",
            note: "Initial security received",
          },
        ],
      },

      {
        id: 103,
        unitNo: "103",
        type: "Room",
        deskNo: null,
        status: "Available",
        purpose: "Room",
        monthlyRent: 28000,
        rentStartDate: null,
        unitImage: null,
        tenant: null,
        initialPayment: null,
        rentHistory: [],
        securityHistory: [],
      },

      // Desk example
      {
        id: 104,
        unitNo: "101",
        type: "Desk",
        deskNo: "D-04",
        status: "Rented",
        purpose: "Workspace",
        monthlyRent: 4000,
        rentStartDate: "2026-08-19",
        unitImage: null,

        tenant: {
          name: "Ahmed Khan",
          cnic: "37405-3333333-1",
          phone: "0300-0000000",
          reference: "Software wala bacha",
          image: null,
          agreement: [],
        },

        initialPayment: {
          cashReceived: 12000,
          rentPaid: 4000,
          securityReceived: 8000,
          securityStatus: "Held",
          paymentDateTime: "2026-08-19T10:30:00.000Z",
          rentMonths: 1,
        },

        rentHistory: [
          {
            id: 1,
            month: "2026-08",
            amount: 4000,
            status: "Paid",
            paidAt: "2026-08-19T10:30:00.000Z",
          },
        ],

        securityHistory: [
          {
            id: 1,
            type: "received",
            amount: 8000,
            date: "2026-08-19T10:30:00.000Z",
            note: "Initial security received",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    buildingNo: "Building #02",
    reference: "Satellite Town",
    address: "Satellite Town, Sargodha",
    totalUnits: 16,
    status: "Active",

    rooms: [
      {
        id: 201,
        unitNo: "201",
        type: "Room",
        deskNo: null,
        status: "Rented",
        purpose: "Office",
        monthlyRent: 22000,
        rentStartDate: "2026-05-20",
        unitImage: null,

        tenant: {
          name: "Usman Khan",
          cnic: "37405-1111111-1",
          phone: "0321-1111111",
          reference: "Client",
          image: null,
          agreement: [],
        },

        initialPayment: {
          cashReceived: 92000,
          rentPaid: 22000,
          securityReceived: 70000,
          securityStatus: "Held",
          paymentDateTime: "2026-05-20T09:45:00.000Z",
          rentMonths: 1,
        },

        rentHistory: [
          {
            id: 1,
            month: "2026-05",
            amount: 22000,
            status: "Paid",
            paidAt: "2026-05-20T09:45:00.000Z",
          },
        ],

        securityHistory: [
          {
            id: 1,
            type: "received",
            amount: 70000,
            date: "2026-05-20T09:45:00.000Z",
            note: "Initial security received",
          },
        ],
      },

      {
        id: 202,
        unitNo: "202",
        type: "Room",
        deskNo: null,
        status: "Available",
        purpose: "Room",
        monthlyRent: 25000,
        rentStartDate: null,
        unitImage: null,
        tenant: null,
        initialPayment: null,
        rentHistory: [],
        securityHistory: [],
      },
    ],
  },

  {
    id: 3,
    buildingNo: "Building #03",
    reference: "Faisalabad Road",
    address: "Faisalabad Road, Sargodha",
    totalUnits: 20,
    status: "Active",

    rooms: [
      {
        id: 301,
        unitNo: "301",
        type: "Room",
        deskNo: null,
        status: "Rented",
        purpose: "Office",
        monthlyRent: 35000,
        rentStartDate: "2026-08-01",
        unitImage: null,

        tenant: {
          name: "Hassan Ali",
          cnic: "37405-2222222-1",
          phone: "0333-2222222",
          reference: "Software wala bacha",
          image: null,
          agreement: [],
        },

        initialPayment: {
          cashReceived: 155000,
          rentPaid: 35000,
          securityReceived: 120000,
          securityStatus: "Held",
          paymentDateTime: "2026-08-01T12:20:00.000Z",
          rentMonths: 1,
        },

        rentHistory: [
          {
            id: 1,
            month: "2026-08",
            amount: 35000,
            status: "Paid",
            paidAt: "2026-08-01T12:20:00.000Z",
          },
        ],

        securityHistory: [
          {
            id: 1,
            type: "received",
            amount: 120000,
            date: "2026-08-01T12:20:00.000Z",
            note: "Initial security received",
          },
        ],
      },

      {
        id: 302,
        unitNo: "302",
        type: "Room",
        deskNo: null,
        status: "Available",
        purpose: "Room",
        monthlyRent: 30000,
        rentStartDate: null,
        unitImage: null,
        tenant: null,
        initialPayment: null,
        rentHistory: [],
        securityHistory: [],
      },
    ],
  },
];