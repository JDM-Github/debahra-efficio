import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTachometerAlt, faComment, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import './Navigation.scss';

function SearchInput() {
	return (
		<div className="search-container">
			<input type="text" placeholder="Search..." className="search-input" />
			<button className="search-btn">
				<FontAwesomeIcon icon={faSearch} />
			</button>
		</div>
	);
}

export default function Navigation()
{
	const location = useLocation();
	return (
		<div className={`admin-navigation`}>
			<div className="logo-text">
				<div className="logo"></div>
				<div className="text">DE BAHRA</div>
			</div>

			<div className="user-account">
				<div className="logo"></div>
				<div className="texts">
					<div className="name">John Dave Pega</div>
					<div className="position">ADMIN</div>
				</div>
			</div>

			<hr style={{ color: '#76B349', backgroundColor: '#76B349', border: 'none', height: 2}} />

			<SearchInput />
			<div className="nav-items">
                <NavLink to="/admin" className={({ isActive }) => (
                	location.pathname === '/admin' ||
                	location.pathname === '/admin/' ? 'active-link' : '')}>
                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                    <div>Dashboard</div>
                </NavLink>
            </div>
            <div className="nav-items">
                <NavLink to="/admin/chats" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <FontAwesomeIcon icon={faComment} className="nav-icon" />
                    <div>Chats</div>
                </NavLink>
            </div>
            <div className="nav-items">
                <NavLink to="accounts" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <FontAwesomeIcon icon={faUser} className="nav-icon" />
                    <div>Accounts</div>
                </NavLink>
            </div>
            <div className="nav-items">
                <NavLink to="/admin/request" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
                    <div>Requests</div>
                </NavLink>
            </div>
{/*            <div className="nav-items">
                <NavLink to="/admin/logout" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                    <div>Logout</div>
                </NavLink>
            </div>*/}
		</div>
	);
}
