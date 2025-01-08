import React, { useEffect, useState } from "react";
// import "./SCSS/Modal.scss";
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
	targetId,
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
				"users/get_employee_no_page",
				{
					targetId,
				}
			);
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
		<div className="appointment-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="modal-content bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
				<button
					className="close-button absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900"
					onClick={onClose}
				>
					&times;
				</button>

				<h2 className="form-title text-2xl font-bold text-green-700 text-center">
					ASSIGNING STAFF
				</h2>

				<div className="appointment-details space-y-4">
					<div className="field">
						<label className="block font-medium text-green-700">
							<strong>Assigned Staff:</strong>
						</label>
						<select
							name="staffId"
							value={appointmentData.staffId || ""}
							onChange={handleStaffSelection}
							className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						>
							<option value="">Select Staff</option>
							{requestData.map((staff) => (
								<option key={staff.id} value={staff.id}>
									{staff.firstname} {staff.lastname}
								</option>
							))}
						</select>
					</div>

					{selectedStaff && (
						<div className="field space-y-2">
							<label className="block font-medium text-green-700">
								<strong>Staff Description:</strong>
							</label>
							<textarea
								value={appointmentData.staffDescription || ""}
								onChange={handleChange}
								name="staffDescription"
								readOnly
								className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
							/>
						</div>
					)}
				</div>

				<div className="modal-actions flex justify-between mt-6">
					<button
						onClick={() => onCreate()}
						className="create-btn bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
					>
						Assign Staff
					</button>
					<button
						onClick={onCancel}
						className="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md focus:outline-none"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
