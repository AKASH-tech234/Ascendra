import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f172a",
      cornerRadius: 10,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      grid: { color: "#f1f5f9" },
      ticks: { color: "#64748b" },
    },
  },
};

const barWithLegendOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      cornerRadius: 10,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      grid: { color: "#f1f5f9" },
      ticks: { color: "#64748b" },
    },
  },
};

const lineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      cornerRadius: 10,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      grid: { color: "#f1f5f9" },
      ticks: { color: "#64748b" },
    },
  },
};

export function GoalProgressChart() {
  const data = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "On Track",
        data: [65, 72, 78, 82],
        backgroundColor: "#22c55e",
        borderRadius: 8,
        barThickness: 20,
      },
      {
        label: "At Risk",
        data: [20, 18, 14, 12],
        backgroundColor: "#f59e0b",
        borderRadius: 8,
        barThickness: 20,
      },
      {
        label: "Off Track",
        data: [15, 10, 8, 6],
        backgroundColor: "#ef4444",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="h-64">
      <Bar data={data} options={barWithLegendOptions} />
    </div>
  );
}

export function TeamProgressLineChart() {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Growth",
        data: [45, 52, 58, 64, 72, 82],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563eb",
      },
      {
        label: "Platform",
        data: [40, 42, 50, 55, 60, 68],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#8b5cf6",
      },
    ],
  };

  return (
    <div className="h-64">
      <Line data={data} options={lineOptions} />
    </div>
  );
}

export function CompletionDoughnut() {
  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        cornerRadius: 10,
        padding: 12,
      },
    },
  };

  const data = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [62, 28, 10],
        backgroundColor: ["#22c55e", "#2563eb", "#e2e8f0"],
        borderWidth: 0,
        borderRadius: 4,
        spacing: 3,
      },
    ],
  };

  return (
    <div className="h-64 flex items-center justify-center">
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
}

export function DepartmentBarChart() {
  const data = {
    labels: ["Sales", "Product", "Engineering", "People Ops", "Marketing"],
    datasets: [
      {
        label: "Completion %",
        data: [86, 79, 91, 90, 72],
        backgroundColor: [
          "rgba(37, 99, 235, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  return (
    <div className="h-64">
      <Bar data={data} options={barOptions} />
    </div>
  );
}
