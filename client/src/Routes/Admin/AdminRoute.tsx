import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import Chats from "./Chats.tsx";
import Accounts from "./Accounts.tsx";
import Requests from "./Requests.tsx";
import Navigation from "./Navigation.tsx";
import "./SCSS/AdminRoute.scss";
import RequestAccount from "./RequestAccount.tsx";
import Appointment from "./Appointment.tsx";

export default function AdminRoute() {
	return (
		<div className="admin">
			<Navigation />

			<div className="admin-content">
				<Routes>
					<Route path="chats" element={<Chats />} />
					<Route path="accounts" element={<Accounts />} />
					<Route
						path="request-accounts"
						element={<RequestAccount />}
					/>
					<Route path="request" element={<Requests />} />
					<Route path="appointment" element={<Appointment />} />
					<Route index path="/" element={<Dashboard />} />
				</Routes>
			</div>
		</div>
	);
}
