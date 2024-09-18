import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard.tsx';
import Chats from './Chats.tsx';
import Accounts from './Accounts.tsx';
import Requests from './Requests.tsx';
import Navigation from './Navigation.tsx';

import './AdminRoute.scss';

export default function AdminRoute({ className }) {
	const [isShrunk, setIsShrunk] = useState(true);

	return (
		<div className="admin">
			<Navigation isShrunk={isShrunk} setIsShrunk={setIsShrunk}/>
			<div className="admin-content">
				<Routes>
					<Route path="chats" element={<Chats isShrunk={isShrunk}/>} />
					<Route path="accounts" element={<Accounts/>} />
					<Route path="request" element={<Requests/>} />
					<Route index path="/" element={<Dashboard/>} />
				</Routes>
			</div>
		</div>
	);
}
