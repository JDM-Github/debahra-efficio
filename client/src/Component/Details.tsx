import React from "react";

export default function Details({
	setShowDetails,
	formDetails,
	formName,
	detailImg,
}) {
	return (
		<div className="form-maker">
			<div className="form-card bg-green-50 shadow-lg rounded-lg p-6 w-full max-w-2xl mx-auto">
				<div className="design h-2 bg-green-500 rounded-t-lg"></div>
				<h2 className="form-title text-2xl font-bold text-green-700 mb-4">
					{formName} DETAIL
				</h2>

				<div className="details flex space-x-6">
					<img
						src={detailImg}
						alt=""
						className="w-1/3 rounded-lg shadow-md"
					/>

					<div className="detailed flex flex-col justify-between w-2/3">
						<div className="text-green-600 font-semibold text-lg">
							{formDetails}
						</div>

						<button
							className="cancel-btn mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
							onClick={() => setShowDetails(false)}
						>
							CLOSE
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
