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
			<div className="admin-dashboard">
				<div className="topic">
					<div className="topic-items2">
						<Stats />
					</div>
					<div className="topic-items">
						<RevenueAnalytics />
					</div>
				</div>
				<div className="bottom-topic">
					<div className="big-diagram">
						<TopServices />
					</div>
					<div className="transactions">
						<RecentTransactions />
					</div>
				</div>
			</div>
		</div>
	);
}
