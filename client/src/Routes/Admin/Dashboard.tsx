import React from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import "./SCSS/Dashboard.scss";

export default function Dashboard() {
	return (
		<div className={`admindashboard`}>
			<TopBar clickHandler={null} />
			<div className="admin-dashboard">
				<div className="topic">
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
				</div>
				<div className="bottom-topic">
					<div className="big-diagram"></div>
					<div className="transactions"></div>
				</div>
			</div>
			<Copyright />
		</div>
	);
}
