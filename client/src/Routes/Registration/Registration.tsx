import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard.tsx";
import LoginPage from "./LoginPage.tsx";

export default function Registration() {
	return (
		<div className="admin">
			<div className="admin-content">
				<Routes>
					<Route index path="/" element={<Dashboard />} />
					<Route path="login" element={<LoginPage />} />
				</Routes>
			</div>
		</div>
	);
}
