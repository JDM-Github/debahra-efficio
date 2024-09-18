import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage.tsx';

export default function ClientRoute() {
	const [isShrunk, setIsShrunk] = useState(true);

	return (
		<div className="client">
			<div className="client-content">
				<Routes>
					<Route index path="/" element={<LoginPage />} />
				</Routes>
			</div>
		</div>
	);
}

