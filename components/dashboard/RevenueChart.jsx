"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { dashboardAPI } from "@/lib/api";

const Chart = dynamic(
  () => import("react-apexcharts"),
  {
    ssr: false,
  }
);

export default function RevenueChart() {
  const [chartData, setChartData] = useState({
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    series: [
      {
        name: "Revenue",
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await dashboardAPI.getRevenueChart();
        if (response.data.success) {
          setChartData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load revenue chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

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
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "11px",
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
          fontSize: "11px",
        },
        formatter: (value) =>
          `Rs. ${(value / 1000).toFixed(0)}K`,
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

  const series = chartData.series || [
    {
      name: "Revenue",
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          <p className="mt-0.5 text-xs text-slate-500">Loading chart...</p>
        </div>
        <div className="flex-1 animate-pulse bg-slate-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Monthly Revenue</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Revenue performance over the current year
        </p>
      </div>

      <div className="flex-1">
        <Chart
          options={options}
          series={series}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
}