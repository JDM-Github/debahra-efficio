import React, { useState } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import './Navigation.scss';

export default function Navigation({className, isShrunk, setIsShrunk})
{
	const toggleNav = () => setIsShrunk(!isShrunk);

	return (
		<div className={`admin-navigation ${isShrunk ? 'shrunk' : 'expanded'}`}>

			<input className="nav-items" placeholder={isShrunk ? '' : 'Search...'} />
			<div className="nav-items" data-label='DASHBOARD'>
				<Link to="/admin">
					<i className="icon">🏠</i><div>{!isShrunk && 'DASHBOARD'}</div>
				</Link>
			</div>
			<div className="nav-items" data-label='CHATS'>
				<Link to="/admin/chats">
					<i className="icon">💬</i><div>{!isShrunk && 'CHATS'}</div>
				</Link>
			</div>
			<div className="nav-items" data-label='ACCOUNTS'>
				<Link to="/admin/accounts">
					<i className="icon">👤</i><div>{!isShrunk && 'ACCOUNTS'}</div>
				</Link>
			</div>
			<div className="nav-items" data-label='REQUEST'>
				<Link to="/admin/request">
					<i className="icon">📨</i><div>{!isShrunk && 'REQUEST'}</div>
				</Link>
			</div>

			<button className="nav-toggle" onClick={toggleNav}>
				{isShrunk ? '>' : '<'}
			</button>
		</div>
	);
}
