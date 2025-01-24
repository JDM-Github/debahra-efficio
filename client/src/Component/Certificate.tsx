import React from "react";

export default function CertificateModal({ isOpen, onClose, certificate }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-lg shadow-lg w-4/5 max-w-2xl">
				{/* Header */}
				<div className="flex justify-between items-center bg-green-700 text-white p-4 rounded-t-lg">
					<h2 className="text-lg font-bold">
						Certificate of Appointment
					</h2>
					<button
						onClick={onClose}
						className="text-white text-lg hover:text-gray-300 focus:outline-none"
					>
						&times;
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-4">
					<p className="text-sm text-gray-500">
						Issued At: {certificate.issuedAt}
					</p>
					<div className="border rounded-lg p-4 bg-green-100">
						<h3 className="text-lg font-semibold text-green-800">
							{certificate.title}
						</h3>
						<p className="text-sm text-gray-700">
							This certifies that{" "}
							<strong>
								{certificate.user.firstname}{" "}
								{certificate.user.lastname}
							</strong>{" "}
							has an appointment for the service:
						</p>
						<ul className="list-disc list-inside pl-4 text-gray-700">
							<li>
								<strong>Service:</strong>{" "}
								{certificate.service.name}
							</li>
							<li>
								<strong>Appointment Date:</strong>{" "}
								{certificate.appointment.date}
							</li>
							<li>
								<strong>Staff:</strong>{" "}
								{certificate.appointment.staff.firstname}{" "}
								{certificate.appointment.staff.lastname}
							</li>
							<li>
								<strong>Notes:</strong>{" "}
								{certificate.appointment.notes}
							</li>
						</ul>
					</div>
					<p className="text-sm text-gray-600">
						Please keep this certificate for your records.
					</p>
				</div>

				{/* Footer */}
				<div className="flex justify-end items-center bg-green-700 text-white p-4 rounded-b-lg">
					<button
						onClick={onClose}
						className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 focus:outline-none"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
