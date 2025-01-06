import React, { useEffect, useState } from "react";
// import "./TopBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faQuestionCircle,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TopBar({ clickHandler }) {
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("users") === null) {
			sessionStorage.setItem("error-message", "Invalid User Token");
			navigate("/");
		}
		sessionStorage.removeItem("error-message");
	}, []);
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	const [menuOpen, setMenuOpen] = useState(false);

	const handleProfileClick = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="topbar mb-4 bg-green-800 text-white flex items-center justify-between p-2 shadow-md">
			<div className="user-account flex items-center space-x-3">
				<div className="logo w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
					<img
						src={user.profileImg || "/default-profile.png"}
						alt="Profile"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="texts flex flex-col">
					<div className="name text-lg font-semibold">
						{user.firstname
							? `${user.firstname} ${user.lastname}`
							: "ADMINISTRATOR"}
					</div>
				</div>
			</div>

			{user.firstname ? (
				<div
					className="profile-container relative cursor-pointer flex items-center"
					onClick={handleProfileClick}
				>
					<div className="profile-icon text-2xl bg-green-600 p-2 rounded-full ml-2">
						👤
					</div>
				</div>
			) : (
				<></>
			)}

			{menuOpen && (
				<div className="dropdown-menu absolute right-5 mt-36 bg-white text-green-800 rounded-lg shadow-lg w-48 py-2 z-10">
					<div
						className="dropdown-item flex items-center px-4 py-2 hover:bg-green-100 cursor-pointer transition duration-200"
						onClick={clickHandler}
					>
						<FontAwesomeIcon
							icon={faUser}
							className="dropdown-icon mr-2 text-lg"
						/>
						<span>Manage Profile</span>
					</div>
					{/* <div
						className="dropdown-item flex items-center px-4 py-2 hover:bg-green-100 cursor-pointer transition duration-200"
						// onClick={handleLogout}
					>
						<FontAwesomeIcon
							icon={faSignOutAlt}
							className="dropdown-icon mr-2 text-lg"
						/>
						<span>Logout</span>
					</div> */}
				</div>
			)}
		</div>
	);
}
