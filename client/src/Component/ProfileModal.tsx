import React, { useEffect, useState } from "react";
// import "./SCSS/ProfileModal.scss";
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
	if (!user) return null;

	return (
		<div className="profile-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="profile-modal-overlay bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
				<button
					className="close-btn absolute top-3 right-3 text-3xl text-gray-700"
					onClick={onClose}
				>
					✖
				</button>

				<div className="profile-header text-center">
					<img
						src={user.profileImg || "https://placehold.co/600x400"}
						alt="Profile"
						className="profile-img rounded-full w-32 h-32 mx-auto mb-4 object-cover"
					/>
					<h2 className="text-2xl font-semibold text-green-700">
						{user.firstname} {user.lastname}
					</h2>
					<p className="text-lg text-gray-500">@{user.username}</p>
				</div>

				<div className="profile-details space-y-3">
					<p className="text-gray-700">
						<strong>Email:</strong> {user.email}
					</p>
					<p className="text-gray-700">
						<strong>Location:</strong> {user.location}
					</p>
				</div>

				<div className="modal-footer text-center">
					<button
						onClick={onClose}
						className="close-btn-footer bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
