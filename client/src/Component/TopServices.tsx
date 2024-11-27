import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartData,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function TopServices({}) {
	const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

	const sampleTopProducts = [{ name: "DTI REGISTRATION", count: 50 }];

	useEffect(() => {
		if (sampleTopProducts && sampleTopProducts.length > 0) {
			const labels = sampleTopProducts.map((product) => product.name);
			const data = sampleTopProducts.map((product) => product.count);

			setChartData({
				labels,
				datasets: [
					{
						label: "Order Count",
						data,
						backgroundColor: "#71b146",
						borderColor: "#548235",
						borderWidth: 1,
					},
				],
			});
		}
	}, [sampleTopProducts]);

	if (!chartData)
		return (
			<div className="chart-card">
				<h3>Top Products</h3>
				<div className="chart-placeholder">No Top Products.</div>
			</div>
		);

	return (
		<div className="chart-card">
			<h3>Top Services</h3>
			<div className="chart-placeholder">
				<Bar
					data={chartData}
					options={{
						responsive: true,
						plugins: {
							legend: { display: false },
							tooltip: {
								callbacks: {
									label: (tooltipItem) =>
										`Orders: ${tooltipItem.raw}`,
								},
							},
						},
						scales: {
							y: { beginAtZero: true },
						},
					}}
				/>
			</div>
		</div>
	);
}
