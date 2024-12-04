import React, { useState } from "react";
import { toast } from "react-toastify";
import RequestHandler from "../Functions/RequestHandler.js";

interface AddAccountModalProps {
	onClose: () => void;
	onAccountAdded: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
	onClose,
	onAccountAdded,
}) => {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleAddAccount = async () => {
		if (
			!firstname ||
			!lastname ||
			!username ||
			!email ||
			!location ||
			!password ||
			!confirmPassword
		) {
			toast.error("Please fill in all fields.");
			return;
		}

		if (password != confirmPassword) {
			toast.error("Password does not match.");
			return;
		}

		try {
			const response = await RequestHandler.handleRequest(
				"post",
				"users/add_employee",
				{
					firstname,
					lastname,
					username,
					email,
					location,
					password,
				}
			);

			if (response.success) {
				toast.success("Account added successfully!");
				onAccountAdded();
				onClose();
			} else {
				toast.error(response.message || "Failed to add employee.");
			}
		} catch (error) {
			toast.error(`Error: ${error}`);
		}
	};

	return (
		<div className="add-account-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="modal-overlay bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
				<h2 className="text-2xl font-bold text-green-700 text-center mb-6">
					Add New Employee
				</h2>

				<div className="form-group space-y-4">
					<div>
						<input
							type="text"
							placeholder="First Name"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="text"
							placeholder="Last Name"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="text"
							placeholder="Location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>
				</div>

				<div className="button-group flex justify-between mt-6">
					<button
						onClick={handleAddAccount}
						className="add-btn bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
					>
						Add Account
					</button>
					<button
						onClick={onClose}
						className="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md focus:outline-none"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddAccountModal;
