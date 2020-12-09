import React from "react";
import { Bar } from "react-chartjs-2";

const AverageChart = () => {
  const data = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [
      {
        label: "Average Attendance",
        data: [5, 10, 15],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <div className="chart">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AverageChart;
