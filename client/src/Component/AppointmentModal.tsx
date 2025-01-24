import React, { useState } from "react";

export default function ViewAppointmentModal({
	onClose,
	appointmentDate,
	appointmentNotes,
}) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">View Appointment</h2>
				<div className="mb-4">
					<label
						htmlFor="appointmentNotes"
						className="block text-sm font-medium text-gray-700"
					>
						Notes
					</label>
					<textarea
						id="appointmentNotes"
						name="appointmentNotes"
						rows={4}
						value={appointmentNotes}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
						placeholder="Add any notes about the appointment..."
					></textarea>
				</div>
				<div className="flex justify-end space-x-3">
					<button
						type="button"
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
