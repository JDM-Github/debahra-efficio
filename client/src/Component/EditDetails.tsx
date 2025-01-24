import React, { useState } from "react";
import { toast } from "react-toastify";

export default function EditDetails({
	setShowDetails,
	formDetails,
	formName,
	detailImg,
    serviceId,
	initialPrice,
	onSave,
}) {
	const [details, setDetails] = useState(formDetails);
	const [price, setPrice] = useState(initialPrice);

	const handleSave = () => {
		if (price < 1) {
			toast.error("Price must be at least 1.");
			return;
		}
		if (details.trim().length === 0) {
			toast.error("Details cannot be empty.");
			return;
		}
		onSave(serviceId, details, price);
		setShowDetails(false);
	};
	return (
		<div className="form-maker fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="form-card bg-green-50 shadow-lg rounded-lg p-6 w-full max-w-6xl mx-auto">
				<div className="design h-2 bg-green-500 rounded-t-lg"></div>
				<h2 className="form-title text-2xl font-bold text-green-700 mb-4">
					{formName} DETAIL
				</h2>

				<div className="details flex space-x-6">
					<img
						src={detailImg}
						alt="Preview"
						className="w-1/3 rounded-lg shadow-md"
					/>

					<div className="detailed flex flex-col justify-between w-2/3">
						<div className="mb-2">
							<label className="block text-green-600 font-semibold text-lg mb-2">
								Details:
							</label>
							<textarea
								value={details}
								onChange={(e) => {
									if (e.target.value.length <= 200) {
										setDetails(e.target.value);
									}
								}}
								className="w-full border border-green-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
								rows={4}
							/>
						</div>

						{/* <div className="mb-4">
							<label className="block text-green-600 font-semibold text-lg mb-2">
								Price:
							</label>
							<input
								type="number"
								value={price}
								min={1}
								onChange={(e) => {
									const newValue =
										parseFloat(e.target.value) || 1;
									setPrice(Math.max(1, newValue));
								}}
								className="w-full border border-green-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div> */}

						<div className="flex justify-end space-x-4">
							<button
								className="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
								onClick={() => setShowDetails(false)}
							>
								CANCEL
							</button>
							<button
								className="save-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
								onClick={handleSave}
							>
								SAVE
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
