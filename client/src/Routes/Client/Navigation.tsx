import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTachometerAlt,
	faComment,
	faCoffee,
	faEnvelope,
	faSignOutAlt,
	faInfo,
	faMoneyCheckDollar,
	faTimesCircle,
	faCheckCircle,
	faSpinner,
	faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../Component/Navigation.tsx";

export default function ClientNavigation() {
	const location = useLocation();

	return (
		<Navigation
			status={"CLIENT"}
			Nav={
				<>
					<NavLink
						to="/client/"
						className={() =>
							location.pathname === "/client" ||
							location.pathname === "/client/"
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
						to="services"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon icon={faCoffee} className="nav-icon" />
						<div>Services</div>
					</NavLink>

					<hr />

					<NavLink
						to="pending-request"
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
						to="transaction"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faMoneyCheckDollar}
							className="nav-icon"
						/>
						<div>Transactions</div>
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
