import React, { useEffect, useState } from "react";
import "./SCSS/Modal.scss";
import RequestHandler from "../Functions/RequestHandler";
import { toast } from "react-toastify";

interface User {
	id: string;
	profileImg: string;
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	location: string;
	Employees: {
		description: string;
	};
}

export default function AppointmentModal({
	onClose,
	onCreate,
	onCancel,
	appointmentData,
	setAppointmentData,
}) {
	const [requestData, setRequestData] = useState<User[]>([]);
	const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setAppointmentData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get_employee_no_page"
			);
			// alert(JSON.stringify(data));
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				setRequestData(data.data);
			}
		} catch (error) {
			toast.error(`An error occurred while requesting data. ${error}`);
		}
	};
	useEffect(() => {
		loadRequestData();
	}, []);

	const handleStaffSelection = (e) => {
		const selectedStaffId = e.target.value;
		const staff = requestData.find((staff) => staff.id === selectedStaffId);
		if (staff) {
			setSelectedStaff(staff);
			setAppointmentData((prev) => ({
				...prev,
				staffId: selectedStaffId,
				staffDescription: staff ? staff.Employees.description : "",
			}));
		}
	};

	return (
		<div className="appointment-modal-overlay">
			<div className="modal-content">
				<button className="close-button" onClick={onClose}>
					&times;
				</button>
				<h2 className="form-title">ASSIGNING STAFF</h2>
				<div className="appointment-details">
					<label>
						<strong>Assigned Staff:</strong>
					</label>
					<select
						name="staffId"
						value={appointmentData.staffId || ""}
						onChange={handleStaffSelection}
					>
						<option value="">Select Staff</option>
						{/* Render staff options dynamically from requestData */}
						{requestData.map((staff) => (
							<option key={staff.id} value={staff.id}>
								{staff.firstname} {staff.lastname}
							</option>
						))}
					</select>

					{/* Show staff description only when a staff is selected */}
					{selectedStaff && (
						<>
							<label>
								<strong>Staff Description:</strong>
							</label>
							<textarea
								value={appointmentData.staffDescription || ""}
								onChange={handleChange}
								name="staffDescription"
								readOnly
							/>
						</>
					)}
				</div>
				<div className="modal-actions">
					<button
						onClick={() => onCreate(appointmentData)}
						className="create-btn"
					>
						Assign Staff
					</button>
					<button onClick={onCancel} className="cancel-btn">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
