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
} from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../Component/Navigation.tsx";

export default function AdminNavigation() {
	const location = useLocation();
	return (
		<Navigation
			status={"ADMIN"}
			subscribe={null}
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
						to="request-accounts"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon icon={faUser} className="nav-icon" />
						<div>Request Accounts</div>
					</NavLink>

					<NavLink
						to="request"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faEnvelope}
							className="nav-icon"
						/>
						<div>Requests</div>
					</NavLink>

					<NavLink
						to="appointment"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon
							icon={faArchive}
							className="nav-icon"
						/>
						<div>Appointment</div>
					</NavLink>

					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
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
