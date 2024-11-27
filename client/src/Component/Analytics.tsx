import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowUp,
	faArrowDown,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartData,
} from "chart.js";
import "./SCSS/Analytics.scss";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = ["Last Month", "Last Year", "This Month", "This Year"];

const RevenueAnalytics = () => {
	const [revenue, setRevenue] = useState(15000);
	const [revenueChange, setRevenueChange] = useState(15);
	const [trend, setTrend] = useState("up");
	const [timePeriod, setTimePeriod] = useState("This Month");
	const [chartData, setChartData] = useState(null);

	const handlePeriodChange = (e) => {
		const period = e.target.value;
		setTimePeriod(period);
		if (period === "Last Month") {
			updateChartData([12000, 13000, 14000, 15000, 16000], 10);
		} else if (period === "Last Year") {
			updateChartData([100000, 110000, 105000, 120000], -20);
		} else if (period === "This Month") {
			updateChartData([14000, 15000, 15500, 16000], 15);
		} else {
			updateChartData([150000, 170000, 180000], 5);
		}
	};

	const updateChartData = (dataPoints, change) => {
		setRevenue(dataPoints[dataPoints.length - 1]);
		setRevenueChange(change);
		setTrend(change > 0 ? "up" : "down");
		setChartData({
			labels: dataPoints.map((_, i) => `W${i + 1}`),
			datasets: [
				{
					label: "Revenue",
					data: dataPoints,
					borderColor: "#71f146",
					backgroundColor: "rgba(113, 177, 70, 1)",
					tension: 0.4,
					fill: true,
				},
			],
		});
	};

	useEffect(() => {
		updateChartData([14000, 15000, 15500, 16000], 15);
	}, []);

	return (
		<div className="revenue-analytics">
			<div className="chart-bg">
				{chartData && (
					<Line
						data={chartData}
						options={{
							responsive: true,
							plugins: {
								legend: { display: false },
							},
							scales: {
								x: {
									grid: {
										display: true,
										color: "rgba(200, 200, 200, 0.3)",
									},
									ticks: { display: false },
								},
								y: {
									grid: {
										display: true,
										color: "rgba(200, 200, 200, 0.3)",
									},
									ticks: { display: false },
								},
							},
						}}
						style={{
							height: "100%",
							width: "100%",
							maxWidth: "100%",
							minWidth: "100%",
						}}
					/>
				)}
			</div>

			<div className="revenue-info">
				<div className="header">
					<h3>Revenue Overview</h3>
					<select
						className="time-period-select"
						onChange={handlePeriodChange}
						value={timePeriod}
					>
						{options.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				<div className="stats">
					<div className={`change ${trend}`}>
						{revenueChange}%{" "}
						{trend === "up" ? "increase" : "decrease"}
						<FontAwesomeIcon
							icon={trend === "up" ? faArrowUp : faArrowDown}
							className={`icon ${trend}`}
						/>
					</div>
					<div className="revenue-price">
						${revenue.toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RevenueAnalytics;
