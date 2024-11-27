import React, { useState, useEffect } from "react";
import "./SCSS/RecentTransactions.scss";

const mockTransactions = [
	{
		id: 1,
		date: "2024-11-16",
		amount: "$500",
		status: "Completed",
	},
	{
		id: 2,
		date: "2024-11-15",
		amount: "$250",
		status: "Pending",
	},
	{
		id: 3,
		date: "2024-11-14",
		amount: "$150",
		status: "Processing",
	},
	{
		id: 4,
		date: "2024-11-13",
		amount: "$200",
		status: "Completed",
	},
	{
		id: 5,
		date: "2024-11-12",
		amount: "$300",
		status: "Completed",
	},
	{
		id: 5,
		date: "2024-11-12",
		amount: "$300",
		status: "Completed",
	},
	{
		id: 5,
		date: "2024-11-12",
		amount: "$300",
		status: "Completed",
	},
	{
		id: 5,
		date: "2024-11-12",
		amount: "$300",
		status: "Completed",
	},
];

export default function RecentTransactions() {
	const [transactions, setTransactions] = useState(mockTransactions);

	return (
		<div className="recent-transactions">
			<h3>Recent Transactions</h3>
			<div className="transaction-list">
				{transactions.slice(0, 5).map((transaction) => (
					<div key={transaction.id} className="transaction-item">
						<div className="transaction-date">
							{transaction.date}
						</div>
						<div className="transaction-amount">
							{transaction.amount}
						</div>
						<div
							className={`transaction-status ${transaction.status.toLowerCase()}s`}
						>
							{transaction.status}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
