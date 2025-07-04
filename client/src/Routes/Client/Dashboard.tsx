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
					id: user.id,
				}
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				const fakeStatusData = data.statusData || {};
				const requested = data.requests || {};
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
				setRequests(requested);
				setStatusData(fakeStatusData);
				setTransactions(fakeTransactions);
				setPieData({
					labels: Object.keys(fakeStatusData),
					datasets: [
						{
							data: Object.values(fakeStatusData	),
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
	const [requests, setRequests] = useState<any>(null);
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
		<div className="clientdashboard bg-gray-50 min-h-screen">
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
						<div className="mt-6">
							<h3 className="text-base font-semibold text-gray-700 mb-3">
								Not Approved Documents
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{requests &&
									requests.slice(0, 4).flatMap((request) =>
										request.uploadedDocuments
											.filter(
												(document) =>
													!document.isApproved
											)
											.map((document) => (
												<div
													key={document.url}
													className="flex items-center justify-between bg-red-50 border border-red-200 rounded-md p-3 shadow-sm"
												>
													<div className="flex items-center space-x-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5 text-red-500"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															strokeWidth={2}
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
															/>
														</svg>
														<span className="text-sm text-gray-800 font-medium">
															{document.fileName}
														</span>
													</div>
													<a
														href={document.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm text-red-600 font-medium hover:underline"
													>
														View
													</a>
												</div>
											))
									)}
								{requests &&
									requests.every((request) =>
										request.uploadedDocuments.every(
											(doc) => doc.isApproved
										)
									) && (
										<p className="text-sm text-gray-500">
											All documents are approved.
										</p>
									)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Copyright />
		</div>
	);
}
