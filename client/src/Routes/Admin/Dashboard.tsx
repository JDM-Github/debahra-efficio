import React from "react";
import TopBar from "../../Component/TopBar.tsx";
import "./SCSS/Dashboard.scss";
import TopServices from "../../Component/TopServices.tsx";
import RevenueAnalytics from "../../Component/Analytics.tsx";
import Stats from "../../Component/Stats.tsx";
import RecentTransactions from "../../Component/RecentTransaction.tsx";

export default function Dashboard() {
	return (
		<div className={`admindashboard`}>
			<TopBar clickHandler={null} />
			<div className="admin-dashboard"></div>
		</div>
	);
}
