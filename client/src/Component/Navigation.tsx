import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./Navigation.scss";
import { useNavigate } from "react-router-dom";
const image = require("../Assets/logo.png");

function SearchInput() {
	return (
		<div className="search-container">
			<input
				type="text"
				placeholder="Search..."
				className="search-input"
			/>
			<button className="search-btn">
				<FontAwesomeIcon icon={faSearch} />
			</button>
		</div>
	);
}

export default function Navigation({ status, Nav }) {
	return (
		<div
			className={`w-[250px] admin-navigation bg-green-800 text-white shadow-lg h-full flex flex-col p-4 space-y-4`}
		>
			{/* Logo Section */}
			<div className="logo-text flex items-center space-x-2">
				<div className="logo w-[250px]">
					<img
						src={image}
						alt="DE BAHRA Logo"
						className="w-full h-auto object-cover"
					/>
				</div>
			</div>

			{/* User Account Section */}
			{/* <div className="user-account flex items-center space-x-3">
				<div className="logo w-8 h-8 bg-gray-300 rounded-full"></div>
				<div className="texts flex flex-col">
					<div className="name text-lg font-semibold">
						{user.firstname
							? `${user.firstname} ${user.lastname}`
							: "ADMINISTRATOR"}
					</div>
					<div className="position text-sm text-gray-400">
						{status}
					</div>
				</div>
			</div> */}

			<hr className="border-t-2 border-green-500" />

			{/* Navigation Section */}
			<div>{Nav}</div>
		</div>
	);
}
