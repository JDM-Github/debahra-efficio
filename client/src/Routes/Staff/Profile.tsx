import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
// import "./SCSS/Profile.scss";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

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
	const [image, setImage] = useState<any>(null);
	const [profile, setProfile] = useState(user.profileImg);
	const [email, setEmail] = useState(user.email);
	const [username, setUsername] = useState(user.username);
	const [firstname, setFirtname] = useState(user.firstname);
	const [lastname, setLastname] = useState(user.lastname);
	const [location, setLocation] = useState(user.location);

	const updateAccount = async () => {
		let imageUrl = "";
		const toastId = toast.loading("Updating profile...");

		if (image) {
			const formData = new FormData();
			formData.append("file", image);

			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"image/upload-image",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				if (data.success) {
					imageUrl = data.uploadedDocument;
				} else {
					toast.update(toastId, {
						render: data.message,
						type: "error",
						isLoading: false,
						autoClose: 5000,
					});
					return null;
				}
			} catch (error) {
				console.error("Error submitting the document:", error);
				toast.update(toastId, {
					render: "Error submitting the document",
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
				return null;
			}
		}

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/updateProfile",
				{
					id: user.id,
					image: imageUrl,
					email,
					username,
					firstname,
					lastname,
					location,
				}
			);
			if (data.success) {
				toast.update(toastId, {
					render: "Profile updated successfully",
					type: "success",
					isLoading: false,
					autoClose: 5000,
				});
				localStorage.setItem("users", JSON.stringify(data.user));
			} else {
				toast.update(toastId, {
					render: data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
				return null;
			}
		} catch (error) {
			console.error("Error updating the document:", error);
			toast.update(toastId, {
				render: "Error updating the document",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			return null;
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
			const imageUrl = URL.createObjectURL(e.target.files[0]);
			setProfile(imageUrl);
		}
	};

	return (
		<div className="profile">
			<TopBar clickHandler={() => changeURL("profile")} />

			<div className="main-profile flex items-center justify-center relative p-6">
				<div
					className={`account relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transition-all duration-500 ease-in-out transform ${
						showEdit ? "translate-x-[-60%]" : ""
					}`}
				>
					<div className="background-design absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-lg"></div>

					<div className="profile flex flex-col items-center relative z-10">
						<button
							className="edit-button absolute top-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
							onClick={() => setShowEdit((e) => !e)}
						>
							<FontAwesomeIcon
								icon={faEdit}
								className="text-xl"
							/>
						</button>

						{/* Profile Image */}
						<img
							src={profile}
							alt="Profile"
							className="profile-img w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
						/>

						<div className="username text-center text-3xl font-semibold text-green-800 mt-6">
							<input
								type="text"
								value={username.toUpperCase()}
								readOnly
								className="text-center bg-transparent border-none focus:ring-0 w-full"
							/>
						</div>

						<div className="email text-center text-lg text-gray-500 mt-2">
							<input
								type="text"
								value={`@${email.toLowerCase()}`}
								readOnly
								className="text-center bg-transparent border-none focus:ring-0 w-full italic"
							/>
						</div>

						<div className="additional-info mt-6 space-y-4">
							<div className="info-item flex justify-between text-lg text-gray-700">
								<span className="font-semibold">
									First Name:
								</span>
								<input
									type="text"
									value={firstname || "N/A"}
									readOnly
									className="bg-transparent border-none focus:ring-0 text-right"
								/>
							</div>
							<div className="info-item flex justify-between text-lg text-gray-700">
								<span className="font-semibold">
									Last Name:
								</span>
								<input
									type="text"
									value={lastname || "N/A"}
									readOnly
									className="bg-transparent border-none focus:ring-0 text-right"
								/>
							</div>
							<div className="info-item flex justify-between text-lg text-gray-700">
								<span className="font-semibold">Location:</span>
								<input
									type="text"
									value={location || "N/A"}
									readOnly
									className="bg-transparent border-none focus:ring-0 text-right"
								/>
							</div>
						</div>
					</div>
				</div>

				{showEdit && (
					<div className="edit-form absolute right-36	 top-0 w-[40%] bg-white shadow-lg p-6 rounded-lg transition-all duration-500 ease-in-out transform">
						<div className="card">
							<h1 className="form-title text-2xl font-semibold text-center mb-4">
								Edit Profile
							</h1>

							<form className="profile-form">
								<div className="form-group mb-4">
									<label
										htmlFor="profileImage"
										className="text-lg text-green-600"
									>
										Profile Image
									</label>
									<input
										type="file"
										id="profileImage"
										className="input-file border-2 border-gray-300 p-2 rounded-md w-full"
										onChange={handleImageChange}
										accept="image/*"
									/>
								</div>

								{/* Email Field */}
								<div className="form-group mb-4">
									<label htmlFor="email" className="text-lg">
										Email
									</label>
									<input
										type="email"
										id="email"
										className="input-text border-2 border-gray-300 p-2 rounded-md w-full"
										placeholder="Enter your email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</div>

								{/* Username Field */}
								<div className="form-group mb-4">
									<label
										htmlFor="username"
										className="text-lg"
									>
										Username
									</label>
									<input
										type="text"
										id="username"
										className="input-text border-2 border-gray-300 p-2 rounded-md w-full"
										placeholder="Enter your username"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
									/>
								</div>

								{/* First Name */}
								<div className="form-group mb-4">
									<label
										htmlFor="firstname"
										className="text-lg"
									>
										First Name
									</label>
									<input
										type="text"
										id="firstname"
										className="input-text border-2 border-gray-300 p-2 rounded-md w-full"
										placeholder="Enter your first name"
										value={firstname}
										onChange={(e) =>
											setFirtname(e.target.value)
										}
									/>
								</div>

								{/* Last Name */}
								<div className="form-group mb-4">
									<label
										htmlFor="lastname"
										className="text-lg"
									>
										Last Name
									</label>
									<input
										type="text"
										id="lastname"
										className="input-text border-2 border-gray-300 p-2 rounded-md w-full"
										placeholder="Enter your last name"
										value={lastname}
										onChange={(e) =>
											setLastname(e.target.value)
										}
									/>
								</div>

								{/* Location */}
								<div className="form-group mb-6">
									<label
										htmlFor="location"
										className="text-lg"
									>
										Location
									</label>
									<input
										type="text"
										id="location"
										className="input-text border-2 border-gray-300 p-2 rounded-md w-full"
										placeholder="Enter your location"
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
									/>
								</div>

								{/* Action Buttons */}
								<div className="buttons flex justify-between">
									<button
										type="button"
										onClick={updateAccount}
										className="bg-green-600 text-white p-3 rounded-md w-[45%]"
									>
										SUBMIT
									</button>
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
										className="bg-gray-300 text-gray-700 p-3 rounded-md w-[45%]"
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
		</div>
	);
}
