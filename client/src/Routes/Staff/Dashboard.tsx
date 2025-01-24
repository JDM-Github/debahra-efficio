import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import "./SCSS/Dashboard.scss";

import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

export default function Dashboard({ user, changeURL }) {
	const loadAllRequests = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/getStaffDashboard",
				{
					assignedEmployee: user.id,
				}
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				const fakeStatusData = data.statusData || {};
				const fakeTransactions = data.transactions.map(
					(transaction) => ({
						id: transaction.id,
						type: transaction.typeOfTransaction,
						requestId: transaction.requestId,
						amount: transaction.amount.toString(),
						reference: transaction.referenceNumber,
						date: transaction.createdAt.split("T")[0],
					})
				);
				setStatusData(fakeStatusData);
				setTransactions(fakeTransactions);
				setPieData({
					labels: Object.keys(statusData),
					datasets: [
						{
							data: Object.values(statusData),
							backgroundColor: ["#76b349", "#4caf50", "#f44336"],
							hoverOffset: 4,
						},
					],
				});
				setAllTransaction(data.allTransaction);
				setAllRequests(data.allRequests);
			}
		} catch (error) {
			toast.error(`An error occurred while requesting data. ${error}`);
		}
	};
	useEffect(() => {
		loadAllRequests();
	}, []);

	const [allTransaction, setAllTransaction] = useState(0);
	const [allRequests, setAllRequests] = useState(0);
	const [transactions, setTransactions] = useState<any>([]);
	const [statusData, setStatusData] = useState<any>({});
	const [pieData, setPieData] = useState({
		labels: Object.keys(statusData),
		datasets: [
			{
				data: Object.values(statusData),
				backgroundColor: ["#76b349", "#4caf50", "#f44336"],
				hoverOffset: 4,
			},
		],
	});
	return (
		<div className={`clientdashboard`}>
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="px-6 space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="shadow-md p-3 rounded-lg col-span-2 bg-gray">
						<div className="bg-white shadow-md rounded-lg p-2 flex items-center mb-3">
							<h2 className="text-lg font-semibold mb-4 border-l-4 border-green-600 pl-3">
								OVERVIEW
							</h2>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-3">
							<div className="flex items-center bg-green-100 p-4 rounded-lg shadow space-x-4">
								<div className="bg-green-500 text-white p-3 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17 9V7a4 4 0 10-8 0v2m-2 4h12a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-sm text-gray-600">
										Total Requests
									</p>
									<h3 className="text-2xl font-bold text-green-700">
										{allRequests}
									</h3>
								</div>
							</div>
							<div className="flex items-center bg-green-100 p-4 rounded-lg shadow space-x-4">
								<div className="bg-green-500 text-white p-3 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17 9V7a4 4 0 10-8 0v2m-2 4h12a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-sm text-gray-600">
										Total Transactions
									</p>
									<h3 className="text-2xl font-bold text-green-700">
										{allTransaction}
									</h3>
								</div>
							</div>
						</div>

						<div className="bg-white shadow-md p-6 rounded-lg h-[60vh]">
							<h2 className="text-lg font-semibold mb-4 border-l-4 border-green-500 pl-3 text-green-700">
								RECENT TRANSACTIONS
							</h2>
							<ul className="space-y-2">
								{transactions.map((transaction) => (
									<li
										key={transaction.id}
										className="flex justify-between items-center border-b pb-2"
									>
										<div>
											<p className="text-gray-800 font-medium">
												{transaction.type}
											</p>
											<p className="text-sm text-gray-500">
												Reference:{" "}
												{transaction.reference}
											</p>
										</div>
										<button
											className="text-sm font-medium text-green-600 hover:underline"
											onClick={() =>
												console.log(
													`Details for Transaction ${transaction.id}`
												)
											}
										>
											View Details
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Pie Chart */}
					<div className="bg-white shadow-md p-6 rounded-lg">
						<h2 className="text-lg font-semibold mb-4">
							Request Status
						</h2>
						<Pie data={pieData} />
					</div>
				</div>
			</div>
			<Copyright />
		</div>
	);
}
