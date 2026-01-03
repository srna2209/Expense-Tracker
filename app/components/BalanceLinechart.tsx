"use client";

import { Line } from "react-chartjs-2";
import { Expense } from '../page';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { balanceData } from "./LineChartData";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

type BalanceProps = {
    userId: string;
    expenses: Expense[];
}

export default function BalanceLineChart({ expenses}: BalanceProps) {
  const data = balanceData(expenses);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 30,
          maxTicksLimit: 7,
        },
        grid: {
          display: false,
        }
      },
      y: {
        ticks: {
          font: {
            size: 8,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full sm:h-52 h-58 rounded-md shadow-md p-5 pt-1 flex flex-row justify-center">
      <div className="bg-white p-3 w-full text-sm ">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
