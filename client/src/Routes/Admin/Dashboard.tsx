import React from "react";
import TopBar from "../../Component/TopBar.tsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Line, Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	BarElement,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function Dashboard() {
	const data = {
		labels: [
			"Week 1",
			"Week 2",
			"Week 3",
			"Week 4",
			"Week 5",
			"Week 6",
			"Week 7",
		],
		datasets: [
			{
				label: "Revenue (₱)",
				data: [2000, 3000, 2500, 4000, 3500, 5000, 6000],
				borderColor: "#34D399",
				backgroundColor: "rgba(52, 211, 153, 0.2)",
				fill: true,
				tension: 0.4,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem) {
						return `₱${tooltipItem.raw.toLocaleString()}`;
					},
				},
			},
		},
		scales: {
			y: {
				ticks: {
					beginAtZero: true,
					callback: function (value) {
						return `₱${value.toLocaleString()}`;
					},
				},
			},
		},
	};

	const salesData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "Sales (₱)",
				data: [1000, 1500, 1200, 1800, 1600, 2000],
				backgroundColor: "rgba(34,197,94,0.6)",
				borderColor: "rgba(34,197,94,1)",
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem) => `₱${tooltipItem.raw}`,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value) {
						return `₱${value}`;
					},
				},
			},
		},
	};

	return (
		<div className="bg-gray-100 min-h-screen flex flex-col">
			<TopBar clickHandler={null} />

			<div className="flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-300">
				<div className="bg-white rounded-lg shadow-md p-4 w-full lg:w-1/3 border border-gray-200">
					<div className="bg-white p-4 rounded-lg shadow-sm mb-4">
						<h3 className="text-lg font-semibold text-green-600 mb-3">
							Calendar
						</h3>
						<div className="h-100 bg-gray-100 rounded-lg overflow-hidden">
							<Calendar />
						</div>
					</div>

					<h3 className="text-lg font-semibold text-green-600 mb-3">
						Overview
					</h3>
					<div className="space-y-3">
						<div className="bg-green-50 p-3 rounded-lg shadow-sm flex items-center justify-between border-l-4 border-green-600">
							<span className="text-gray-500">Total Users</span>
							<span className="text-green-600 font-bold">
								1,250
							</span>
						</div>
						<div className="bg-green-50 p-3 rounded-lg shadow-sm flex items-center justify-between border-l-4 border-yellow-600">
							<span className="text-gray-500">
								Pending Requests
							</span>
							<span className="text-yellow-600 font-bold">
								65
							</span>
						</div>
						<div className="bg-green-50 p-3 rounded-lg shadow-sm flex items-center justify-between border-l-4 border-blue-600">
							<span className="text-gray-500">
								Completed Requests
							</span>
							<span className="text-blue-600 font-bold">
								1,125
							</span>
						</div>
						<div className="bg-green-50 p-3 rounded-lg shadow-sm flex items-center justify-between border-l-4 border-green-600">
							<span className="text-gray-500">Revenue</span>
							<span className="text-green-600 font-bold">
								₱12,500
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full lg:w-2/3 gap-4">
					<div className="bg-white p-4  rounded-lg shadow-md border border-gray-200">
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-lg font-semibold text-green-600">
								Revenue Analytics
							</h3>
							<span className="text-sm text-gray-500">
								Last 30 days
							</span>
						</div>

						<div className="h-[300px] lg:h-[400px]">
							<Line data={data} options={options} />
						</div>
					</div>

					<div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
						<h3 className="text-lg font-semibold text-green-600 mb-3">
							Sales Statistics
						</h3>
						{/* Bar chart container */}
						<div className="h-[300px] lg:h-[400px] bg-gray-100 rounded-lg p-4">
							<Bar data={salesData} options={chartOptions} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
