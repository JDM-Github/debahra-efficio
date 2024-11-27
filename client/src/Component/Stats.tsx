import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./SCSS/Stats.scss";

export default function Stats() {
	return (
		<>
			<div className="stat-card">
				<FontAwesomeIcon icon={faUsers} className="stat-icon" />
				<div className="stat-value">150</div>
				<div className="stat-label">Total Users</div>
			</div>
			<div className="stat-card">
				<FontAwesomeIcon icon={faClipboardList} className="stat-icon" />
				<div className="stat-value">45</div>
				<div className="stat-label">Ongoing Requests</div>
			</div>
		</>
	);
}
