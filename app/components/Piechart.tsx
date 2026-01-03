'use client'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { labels: string[]; values: number[] };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Amount",
        data: data.values,
        backgroundColor: [
            "#34D399", 
            "#F87171",
          
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display:false,
        // position: "right" as const,
        // labels: { color: "#374151", font: { size: 14 } },
      },
    },
    responsive: true,
  };

  return (
    <div className="flex flex-col items-center">
      <Pie data={chartData} options={options} />
    </div>
  );
}
export default PieChart
