import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import Chats from "./Chats.tsx";
import About from "./About.tsx";
import Services from "./Services.tsx";
import Profile from "./Profile.tsx";
import { useNavigate } from "react-router-dom";
import ClientNavigation from "./Navigation.tsx";

import "./SCSS/Client.scss";
import Transaction from "./Transaction.tsx";
import PendingRequest from "./PendingRequest.tsx";
import OngoingRequest from "./OngoingRequest.tsx";
import CompletedRequest from "./CompletedRequest.tsx";
import CancelledRequest from "./CancelledRequest.tsx";
import { ToastContainer } from "react-toastify";
import PaymentSuccess from "./PaymentSuccess.tsx";
import PaymentFailed from "./PaymentFailed.tsx";
import Appointment from "./Appointment.tsx";

export default function ClientRoute() {
	const [isShrunk, setIsShrunk] = useState(false);
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
			<ClientNavigation setIsShrunk={setIsShrunk} isShrunk={isShrunk} />
			<div className={`client-content ${isShrunk ? "shrink" : ""}`}>
				<Routes>
					<Route
						index
						path="/"
						element={
							<Dashboard user={user} changeURL={changeURL} />
						}
					/>
					<Route
						path="chats"
						element={<Chats changeURL={changeURL} />}
					/>
					<Route
						path="payment-success"
						element={<PaymentSuccess />}
					/>
					<Route path="payment-failed" element={<PaymentFailed />} />
					<Route
						path="payment-failed"
						element={<Chats changeURL={changeURL} />}
					/>
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
					/>
					<Route
						path="transaction"
						element={
							<Transaction user={user} changeURL={changeURL} />
						}
					/>

					{/* <Route
						path="pending-request"
						element={
							<PendingRequest user={user} changeURL={changeURL} />
						}
					/> */}
					<Route
						path="ongoing-request"
						element={
							<OngoingRequest user={user} changeURL={changeURL} />
						}
					/>
					<Route
						path="completed-request"
						element={
							<CompletedRequest
								user={user}
								changeURL={changeURL}
							/>
						}
					/>
					<Route
						path="appointment"
						element={<Appointment user={user} />}
					/>
					<Route
						path="cancelled-request"
						element={
							<CancelledRequest
								user={user}
								changeURL={changeURL}
							/>
						}
					/>
				</Routes>
			</div>
			<ToastContainer />
		</div>
	);
}
