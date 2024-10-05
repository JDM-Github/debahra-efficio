import React, { useState } from 'react';
import './TopBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function TopBar() {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleProfileClick = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="topbar">
			<div className="profile-container" onClick={handleProfileClick}>
				<div className="profile-icon">👤</div>
				{menuOpen && (
					<div className="dropdown-menu">
						<div className="dropdown-item">
							<FontAwesomeIcon icon={faUser} className="dropdown-icon" />
							<span>Manage Profile</span>
						</div>
						<div className="dropdown-item">
							<FontAwesomeIcon icon={faQuestionCircle} className="dropdown-icon" />
							<span>Help</span>
						</div>
						<div className="dropdown-item logout">
							<FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
							<span>Logout</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
