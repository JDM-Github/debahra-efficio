import React, { useState } from "react";
import "./SCSS/AddProgress.scss";
import RequestHandler from "../Functions/RequestHandler";
import { toast } from "react-toastify";

const AddProgressStepModal = ({ requestId, isOpen, onClose }) => {
	const [stepType, setStepType] = useState("");
	const [stepDetails, setStepDetails] = useState("");

	const handleAdd = async () => {
		if (stepType && stepDetails) {
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"request/add-progress",
					{
						requestId,
						step: {
							label: stepType,
							details: stepDetails,
						},
					}
				);
				if (data.success) {
					toast.success("Successfully add the progress step");
				} else {
					toast.error(data.message);
					return;
				}
			} catch (error) {
				toast.error("Error adding the progress step");
				return;
			}
			setStepType("");
			onClose();
		} else {
			toast.error("Please enter a step type and step details.");
		}
	};

	if (!isOpen) return null;

	return (
		<div className="add-progress-modal-overlay">
			<div className="add-progress-modal">
				<h2>Add Progress Step</h2>
				<div className="add-progress-modal-content">
					<label>
						<input
							type="text"
							value={stepType}
							onChange={(e) => setStepType(e.target.value)}
							placeholder="Enter step type"
						/>
						<textarea
							value={stepDetails}
							onChange={(e) => setStepDetails(e.target.value)}
							placeholder="Enter step details"
						/>
					</label>
				</div>
				<div className="add-progress-modal-actions">
					<button
						className="add-progress-add-button"
						onClick={handleAdd}
					>
						Add
					</button>
					<button
						className="add-progress-cancel-button"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddProgressStepModal;
