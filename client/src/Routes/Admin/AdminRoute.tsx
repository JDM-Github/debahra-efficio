import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import Chats from "./Chats.tsx";
import Accounts from "./Accounts.tsx";
import Requests from "./Requests.tsx";
import Navigation from "./Navigation.tsx";
import "./SCSS/AdminRoute.scss";
import RequestAccount from "./RequestAccount.tsx";
import Employees from "./Employee.tsx";
import OngoingRequest from "./OngoingRequest.tsx";
import CompletedRequest from "./CompletedRequest.tsx";
import Transaction from "./Transaction.tsx";
import ActivityLog from "./ActivityLog.tsx";
import { ToastContainer } from "react-toastify";
import CancelledRequest from "./CancelledRequest.tsx";
import Appointment from "./Appointment.tsx";

export default function AdminRoute() {
	return (
		<div className="admin">
			<Navigation />

			<div className="admin-content">
				<Routes>
					<Route path="chats" element={<Chats />} />
					<Route path="accounts" element={<Accounts />} />
					<Route path="employee" element={<Employees />} />
					<Route
						path="request-accounts"
						element={<RequestAccount />}
					/>
					<Route path="request" element={<Requests />} />
					<Route
						path="ongoing-request"
						element={<OngoingRequest />}
					/>
					<Route
						path="completed-request"
						element={<CompletedRequest />}
					/>
					<Route
						path="cancelled-request"
						element={<CancelledRequest />}
					/>
					<Route
						path="transaction-history"
						element={<Transaction />}
					/>
					<Route path="activity-log" element={<ActivityLog />} />

					<Route path="appointment" element={<Appointment />} />
					<Route index path="/" element={<Dashboard />} />
				</Routes>
			</div>
			<ToastContainer />
		</div>
	);
}
