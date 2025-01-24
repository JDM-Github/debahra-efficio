import React, { useEffect, useState } from "react";
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



export default function Navigation({ setIsShrunk, isShrunk, status, Nav }) {
	return (
		<div
			className={`${
				isShrunk ? "w-[60px]" : "w-[250px]"
			} admin-navigation bg-green-800 text-white shadow-lg h-full flex flex-col p-4 space-y-4 transition-all duration-300`}
		>
			{/* Logo Section */}
			<div
				className="logo-text flex items-center space-x-2 cursor-pointer"
				onClick={() => setIsShrunk(!isShrunk)}
			>
				<div className={`logo ${isShrunk ? "w-[40px]" : "w-[250px]"}`}>
					<img
						src={image}
						alt="DE BAHRA Logo"
						className="w-full h-auto object-cover"
					/>
				</div>
			</div>

			<hr className="border-t-2 border-green-500" />
			<div className={`nav-container ${isShrunk ? "shrink" : ""}`}>
				{Nav}
			</div>
		</div>
	);
}
