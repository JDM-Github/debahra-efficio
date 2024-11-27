import React, { useState } from "react";
import "./SCSS/AddAccountModal.scss";
import { toast } from "react-toastify";
import RequestHandler from "../Functions/RequestHandler.js";

interface AddAccountModalProps {
	onClose: () => void;
	onAccountAdded: () => void; // Callback for refreshing data
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
		<div className="add-account-modal">
			<div className="modal-overlay">
				<div className="modal-content">
					<h2>Add New Employee</h2>
					<div className="form-group">
						<input
							type="text"
							placeholder="First Name"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Last Name"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<div className="button-group">
						<button onClick={handleAddAccount} className="add-btn">
							Add Account
						</button>
						<button onClick={onClose} className="cancel-btn">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddAccountModal;
