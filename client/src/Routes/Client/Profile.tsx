import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import "./Profile.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProfileModal from "../../Component/ProfileModal.tsx";

export default function Dashboard({ changeURL }) {
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("users") === null) {
			sessionStorage.setItem("error-message", "Invalid User Token");
			navigate("/");
		}
		sessionStorage.removeItem("error-message");
	}, []);
	const user = JSON.parse(localStorage.getItem("users") || "{}");

	const [showEdit, setShowEdit] = useState(false);
	const [profile, setProfile] = useState(user.profileImg);
	const [email, setEmail] = useState(user.email);
	const [username, setUsername] = useState(user.username);
	const [firstname, setFirtname] = useState(user.firstname);
	const [lastname, setLastname] = useState(user.lastname);
	const [location, setLocation] = useState(user.location);

	const updateAccount = () => {};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const imageUrl = URL.createObjectURL(e.target.files[0]);
			setProfile(imageUrl);
		}
	};

	return (
		<div className={`profile`}>
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-profile">
				<div
					className="account"
					style={{ left: showEdit ? "0" : "25%" }}
				>
					<div className="background-design"></div>
					<div className="design"></div>
					<div className="profile">
						<button
							className="edit-button"
							onClick={() => setShowEdit((e) => !e)}
						>
							EDIT
						</button>
						<img src={profile}></img>
					</div>

					<div className="username">{username.toUpperCase()}</div>
					<div className="email">
						<i>@{email.toLowerCase()}</i>
					</div>
				</div>

				{showEdit && (
					<div className="edit-form">
						<div className="card">
							<h1 className="form-title">Edit Profile</h1>

							<form className="profile-form">
								<div className="form-group">
									<label
										htmlFor="profileImage"
										className="import-image"
									>
										Profile Image
									</label>
									<input
										type="file"
										id="profileImage"
										className="input-file"
										onChange={handleImageChange}
										accept="image/*"
									/>
								</div>

								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										className="input-text"
										placeholder="Enter your email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="username">Username</label>
									<input
										type="text"
										id="username"
										className="input-text"
										placeholder="Enter your username"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="username">First Name</label>
									<input
										type="text"
										id="firstname"
										className="input-text"
										placeholder="Enter your username"
										value={firstname}
										onChange={(e) =>
											setFirtname(e.target.value)
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="username">Last Name</label>
									<input
										type="text"
										id="firstname"
										className="input-text"
										placeholder="Enter your username"
										value={lastname}
										onChange={(e) =>
											setLastname(e.target.value)
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="username">Location</label>
									<input
										type="text"
										id="firstname"
										className="input-text"
										placeholder="Enter your username"
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
									/>
								</div>

								<div className="buttons">
									<button type="submit">SUBMIT</button>
									<button
										type="reset"
										onClick={() => {
											setUsername(user.username);
											setEmail(user.email);
											setFirtname(user.firstname);
											setLastname(user.lastname);
											setLocation(user.location);
											setProfile(user.profileImg);
										}}
									>
										RESET
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
			<Copyright />
			<ToastContainer />
		</div>
	);
}
