import React, { useState } from "react";
import "./Dashboard.scss";
import Copyright from "../../Component/Copyright.tsx";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestHandler from "../../Functions/RequestHandler.js";

const background = require("../../Assets/logo.png");

export default function LoginPage() {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);

	const [loginInfo, setLoginInfo] = useState({
		email: "",
		password: "",
	});

	const [requestInfo, setRequestInfo] = useState({
		companyName: "",
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleLoginInfo = (e) => {
		const { name, value } = e.target;
		setLoginInfo((old) => ({
			...old,
			[name]: value,
		}));
	};
	const handleRequestInfo = (e) => {
		const { name, value } = e.target;
		setRequestInfo((old) => ({
			...old,
			[name]: value,
		}));
	};

	const handleLogin = async () => {
		if (loginInfo.email == "admin" && loginInfo.password == "admin") {
			localStorage.setItem(
				"users",
				JSON.stringify({
					id: "ADMIN",
				})
			);
			navigate("/admin");
		} else {
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"users/login",
					loginInfo
				);

				if (data.success) {
					localStorage.setItem("users", JSON.stringify(data.user));
					toast.success("Login successful!");
					if (data.user.isAdmin) {
						navigate("/admin");
					} else if (data.user.isEmployee) {
						navigate("/staff");
					} else {
						navigate("/client");
					}
				} else {
					toast.error(
						data.message ||
							"Login failed, please check your credentials."
					);
				}
			} catch (error) {
				toast.error(`An error occurred while logging in. ${error}`);
			}
		}
	};

	const handleRequest = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/request",
				requestInfo
			);

			if (data.success) {
				toast.success(
					"Request successful! Please wait for admin to verify your request"
				);
				setRequestInfo({
					companyName: "",
					firstName: "",
					lastName: "",
					username: "",
					email: "",
					password: "",
					confirmPassword: "",
				});
			} else {
				toast.error(
					data.message ||
						"Request failed, please check your credentials."
				);
			}
		} catch (error) {
			toast.error(`An error occurred while requesting. ${error}`);
		}
	};
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="dashboard">
			<div className="top"></div>
			<div className="middle">
				<div className="login-page">
					<div className="login">
						<h1>Login</h1>
						<input
							type="text"
							name="email"
							placeholder="Email"
							value={loginInfo.email}
							onChange={handleLoginInfo}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleLogin();
								}
							}}
							required
						/>
						<div
							className="relative"
							style={{ marginBottom: "30px !important" }}
						>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Password"
								value={loginInfo.password}
								onChange={handleLoginInfo}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleLogin();
									}
								}}
								className=" w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<span
								className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-5 h-5 text-gray-500"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.98 8.223c.766-1.101 3.5-5.223 8.02-5.223s7.254 4.122 8.02 5.223a1.5 1.5 0 010 1.554c-.766 1.101-3.5 5.223-8.02 5.223s-7.254-4.122-8.02-5.223a1.5 1.5 0 010-1.554zM12 15a3 3 0 100-6 3 3 0 000 6z"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-5 h-5 text-gray-500"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.98 8.223c.766-1.101 3.5-5.223 8.02-5.223s7.254 4.122 8.02 5.223a1.5 1.5 0 010 1.554c-.766 1.101-3.5 5.223-8.02 5.223s-7.254-4.122-8.02-5.223a1.5 1.5 0 010-1.554zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 2.25l19.5 19.5"
										/>
									</svg>
								)}
							</span>
						</div>
						<button
							className="mt-6"
							type="submit"
							onClick={handleLogin}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleLogin();
								}
							}}
						>
							LOGIN
						</button>
						<center>
							<span>or</span>
						</center>
						<center>
							<div
								className="request-reg"
								onClick={() => setIsLogin(false)}
							>
								REQUEST REGISTER
							</div>
						</center>
					</div>
					<div className="register">
						<h1>
							<center>Request Register</center>
						</h1>

						<input
							name="companyName"
							type="text"
							placeholder="Company Name"
							onChange={handleRequestInfo}
							value={requestInfo.companyName}
						/>

						<input
							name="firstName"
							type="text"
							placeholder="First Name"
							onChange={handleRequestInfo}
							value={requestInfo.firstName}
						/>
						<input
							name="lastName"
							type="text"
							placeholder="Last Name"
							onChange={handleRequestInfo}
							value={requestInfo.lastName}
						/>
						<input
							name="username"
							type="text"
							placeholder="Username"
							onChange={handleRequestInfo}
							value={requestInfo.username}
						/>
						<input
							name="email"
							type="text"
							placeholder="Email"
							onChange={handleRequestInfo}
							value={requestInfo.email}
						/>
						<input
							name="password"
							type="password"
							placeholder="Password"
							value={requestInfo.password}
							onChange={handleRequestInfo}
							required
						/>
						<input
							name="confirmPassword"
							type="password"
							placeholder="Confirm Password"
							onChange={handleRequestInfo}
							value={requestInfo.confirmPassword}
							required
						/>
						<button onClick={handleRequest}>REQUEST</button>

						<center>
							<span>or</span>
						</center>
						<center>
							<div
								className="request-reg"
								onClick={() => setIsLogin(true)}
							>
								Already have account? Login
							</div>
						</center>
					</div>
					<img
						src={background}
						alt="BG"
						className="display"
						style={{
							transform: isLogin ? "translateX(100%)" : "none",
						}}
					/>
				</div>
			</div>
			<Copyright />
			<ToastContainer />
		</div>
	);
}
