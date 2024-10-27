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
} from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../Component/Navigation.tsx";

export default function AdminNavigation({ setIsOpen }) {
	const location = useLocation();

	return (
		<Navigation
			status={"CLIENT"}
			setIsOpen={setIsOpen}
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

					{/* <NavLink
						to="about"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon icon={faInfo} className="nav-icon" />
						<div>About</div>
					</NavLink> */}

					<NavLink
						to="services"
						className={({ isActive }) =>
							isActive ? "nav-items active-link" : "nav-items"
						}
					>
						<FontAwesomeIcon icon={faCoffee} className="nav-icon" />
						<div>Services</div>
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
