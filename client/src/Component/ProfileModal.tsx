import React, { useEffect, useState } from "react";
import "./SCSS/ProfileModal.scss";
import { toast } from "react-toastify";
import RequestHandler from "../Functions/RequestHandler";

interface User {
	profileImg: string;
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	location: string;
}

interface ProfileModalProps {
	user: User;
	onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
	if (!user) return null; // If user data is not loaded, don't render the modal

	return (
		<div className="profile-modal">
			<div className="profile-modal-overlay">
				<div className="profile-modal-content">
					<button className="close-btn" onClick={onClose}>
						✖
					</button>
					<div className="profile-header">
						<img
							src={
								user.profileImg ||
								"https://placehold.co/600x400"
							}
							alt="Profile"
							className="profile-img"
						/>
						<h2>
							{user.firstname} {user.lastname}
						</h2>
						<p className="username">@{user.username}</p>
					</div>
					<div className="profile-details">
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						<p>
							<strong>Location:</strong> {user.location}
						</p>
					</div>
					<div className="modal-footer">
						<button onClick={onClose} className="close-btn-footer">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
