"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(
  () => import("react-apexcharts"),
  {
    ssr: false,
  }
);

export default function RevenueChart() {
  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "transparent",
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    grid: {
      borderColor: "#1e293b",
      strokeDashArray: 4,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
      ],

      labels: {
        style: {
          colors: "#64748b",
        },
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
        },

        formatter: (value) =>
          `Rs. ${Number(value).toLocaleString()}`,
      },
    },

    tooltip: {
      theme: "dark",

      y: {
        formatter: (value) =>
          `Rs. ${Number(value).toLocaleString()}`,
      },
    },

    colors: ["#6366f1"],

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.03,
        stops: [0, 90, 100],
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [
        320000,
        380000,
        410000,
        450000,
        490000,
        530000,
        610000,
        680000,
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Monthly Revenue
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Revenue performance over the current year
        </p>
      </div>

      <Chart
        options={options}
        series={series}
        type="area"
        height={340}
      />
    </div>
  );
}