import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTachometerAlt,
	faComment,
	faUser,
	faEnvelope,
	faSignOutAlt,
	faArchive,
	faListAlt,
	faMoneyCheckDollar,
	faCheckCircle,
	faSpinner,
	faHourglassHalf,
	faUserPlus,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../Component/Navigation.tsx";

export default function AdminNavigation() {
	const location = useLocation();
	return (
		<Navigation
			status={"ADMIN"}
			Nav={
				<>
					<NavLink
						to="/admin"
						className={() =>
							location.pathname === "/admin" ||
							location.pathname === "/admin/"
								? "nav-items active-link"
								: "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faTachometerAlt}
							className="nav-icon"
						/>
						<div>Dashboard</div>
					</NavLink>

					<NavLink
						to="chats"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faComment}
							className="nav-icon"
						/>
						<div>Chats</div>
					</NavLink>

					<NavLink
						to="accounts"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon icon={faUser} className="nav-icon" />
						<div>Accounts</div>
					</NavLink>
					<NavLink
						to="employee"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faEnvelope}
							className="nav-icon"
						/>
						<div>Employee</div>
					</NavLink>

					<hr />
					<NavLink
						to="request-accounts"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faUserPlus}
							className="nav-icon"
						/>
						<div>Request Accounts</div>
					</NavLink>

					<NavLink
						to="request"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faHourglassHalf}
							className="nav-icon"
						/>
						<div>Pending Requests</div>
					</NavLink>

					<NavLink
						to="ongoing-request"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faSpinner}
							className="nav-icon"
						/>
						<div>Ongoing Requests</div>
					</NavLink>

					<NavLink
						to="appointment"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faEnvelope}
							className="nav-icon"
						/>
						<div>Appointment</div>
					</NavLink>

					<NavLink
						to="completed-request"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="nav-icon"
						/>
						<div>Completed Requests</div>
					</NavLink>

					<NavLink
						to="cancelled-request"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faTimesCircle}
							className="nav-icon"
						/>
						<div>Cancelled Requests</div>
					</NavLink>

					<hr />
					<NavLink
						to="transaction-history"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faMoneyCheckDollar}
							className="nav-icon"
						/>
						<div>Transaction History</div>
					</NavLink>

					<NavLink
						to="activity-log"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faListAlt}
							className="nav-icon"
						/>
						<div>Activity Log</div>
					</NavLink>

					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
						onClick={(e) => {
							e.preventDefault();

							if (
								window.confirm(
									"Are you sure you want to log out?"
								)
							) {
								window.location.href = "/";
							}
						}}
					>
						<FontAwesomeIcon
							icon={faSignOutAlt}
							className="nav-icon"
						/>
						<div>Logout</div>
					</NavLink>
				</>
			}
		/>
	);
}
