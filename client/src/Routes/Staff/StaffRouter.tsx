import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./Navigation.tsx";

import "./SCSS/Staff.scss";
import Chats from "./Chats.tsx";
import OngoingRequest from "./OngoingRequest.tsx";
import CompletedRequest from "./CompletedRequest.tsx";
import CancelledRequest from "./CancelledRequest.tsx";
import Transaction from "./Transaction.tsx";
import HandledUsers from "./HandledUsers.tsx";
import { ToastContainer } from "react-toastify";
import Appointment from "./Appointment.tsx";
import Profile from "../Client/Profile.tsx";

export default function StaffRoute() {
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("users") === null) {
			sessionStorage.setItem("error-message", "Invalid User Token");
			navigate("/");
		}
		sessionStorage.removeItem("error-message");
	}, []);
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	const changeURL = (url) => {
		navigate(url);
	};

	return (
		<div className="client">
			<StaffNavigation />
			<div className="client-content">
				<Routes>
					<Route
						index
						path="/"
						element={<Dashboard changeURL={changeURL} />}
					/>
					<Route
						path="chats"
						element={<Chats changeURL={changeURL} />}
					/>

					<Route
						path="ongoing-request"
						element={
							<OngoingRequest changeURL={changeURL} user={user} />
						}
					/>
					<Route
						path="completed-request"
						element={
							<CompletedRequest
								changeURL={changeURL}
								user={user}
							/>
						}
					/>
					<Route
						path="cancelled-request"
						element={
							<CancelledRequest
								changeURL={changeURL}
								user={user}
							/>
						}
					/>
					<Route
						path="profile"
						element={<Profile changeURL={changeURL} />}
					/>
					<Route
						path="appointment"
						element={
							<Appointment user={user} changeURL={changeURL} />
						}
					/>
					<Route
						path="transaction"
						element={
							<Transaction changeURL={changeURL} user={user} />
						}
					/>
					<Route
						path="handle-users"
						element={
							<HandledUsers changeURL={changeURL} user={user} />
						}
					/>
					{/* 
					<Route
						path="about"
						element={<About changeURL={changeURL} />}
					/>
					<Route
						path="services"
						element={<Services changeURL={changeURL} />}
					/>
					<Route
						path="profile"
						element={<Profile changeURL={changeURL} />}
					/> */}
				</Routes>
			</div>
			<ToastContainer />
		</div>
	);
}
