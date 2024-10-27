import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import Chats from "./Chats.tsx";
import About from "./About.tsx";
import Services from "./Services.tsx";
import Profile from "./Profile.tsx";
import SubscriptionModal from "../../Component/Subscription.tsx";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation.tsx";

import "./Client.scss";

export default function ClientRoute() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const changeURL = (url) => {
		navigate(url);
	};

	return (
		<div className="client">
			{isOpen && (
				<SubscriptionModal
					onClose={() => {
						setIsOpen(false);
					}}
				/>
			)}
			<Navigation setIsOpen={setIsOpen} />
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
				</Routes>
			</div>
		</div>
	);
}
