import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faArchive,
	faCheck,
	faEdit,
	faTrash,
	faPlus,
	faFilter,
} from "@fortawesome/free-solid-svg-icons";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Appointment.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ViewAppointmentModal from "../../Component/AppointmentModal.tsx";

const headers = [
	"ID",
	"Request ID",
	"Service Name",
	"Customer Email",
	"Start Date",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.Request.id}</td>
		<td>{item.Request.Service.serviceName}</td>
		<td>{item.userEmail}</td>
		<td>{item.appointmentDate.split("T")[0]}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

export default function Appointment({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	interface Service {
		uploadedDocument: string;
		uploadedDocuments: {
			fileName: string;
			url: string;
			isApproved: boolean;
		}[];
	}
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);

	const [showAppointmentModal, setShowAppointmentModal] = useState(false);
	const [appointmentDate, setAppointmentDate] = useState("");
	const [appointmentNotes, setAppointmentNotes] = useState("");

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "VIEW",
			onClick: (id, item) => viewServiceRequest(item.Request.id),
		},
		{
			icon: faEye,
			className: "done-btn",
			label: "VIEW NOTE",
			onClick: (id, item) => viewAppointment(item),
		},
		{
			icon: faCheck,
			className: "done-btn",
			label: "COMPLETE",
			onClick: (id, item) => completeRequest(item),
		},
	];

	const completeRequest = async (item) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/completeRequest",
				{ id: item.requestId }
			);
			if (!data.success) {
				toast.error(data.message || "Can't complete the request");
			} else {
				toast.success("Service completed successfully!");
			}
		} catch (error) {
			toast.error(`An error occurred while logging in. ${error}`);
		}
	};

	const viewAppointment = async (item) => {
		setAppointmentDate(
			new Date(item.appointmentDate).toISOString().split("T")[0]
		);
		setAppointmentNotes(item.appointmentNotes);
		setShowAppointmentModal(true);
	};

	const loadAllAppointment = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"appointment/get_appointments",
				{ staffId: user.id, currPage, limit }
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				setRequestData(data.data);
				setTotal(data.total);
			}
		} catch (error) {
			toast.error(`An error occurred while requesting data. ${error}`);
		}
	};

	const viewServiceRequest = async (id) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/view_service",
				{ id }
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				setServiceData(data.data);
				setShowServiceModal(true);
			}
		} catch (error) {
			toast.error(`An error occurred while requesting data. ${error}`);
		}
	};

	useEffect(() => {
		loadAllAppointment();
	}, [currPage]);

	return (
		<div className="appointment">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-appointment">
				<div className="title">All Appointment</div>
				<Tabulator
					data={requestData}
					headers={headers}
					renderRow={renderRow}
					actions={actions}
					buttons={[]}
					selects={[]}
					currentPage={currPage}
					setCurrentPage={setCurrPage}
					itemsPerPage={limit}
					total={total}
					searchableHeaders={["id", "appointmentPeople"]}
				/>
			</div>
			{showServiceModal && serviceData && (
				<div className="serviceModal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="modal-content bg-white rounded-lg shadow-lg overflow-hidden min-w-[50vw] w-full min-h-[80vh] max-h-[80vh] p-6">
						<div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
							<h2 className="text-xl font-semibold border-l-4 border-green-600 pl-4">
								Uploaded Documents
							</h2>
							<span
								className="text-5xl text-gray-200 cursor-pointer hover:text-red-500"
								onClick={() => setShowServiceModal(false)}
							>
								&times;
							</span>
						</div>

						<div className="overflow-y-auto">
							<table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-green-100">
										<th className="border border-gray-200 px-4 py-2 text-left text-gray-800 font-semibold">
											File Name
										</th>
										<th className="border border-gray-200 px-4 py-2 text-gray-800 font-semibold">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{serviceData.uploadedDocuments.map(
										(document, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50 transition-all duration-200"
											>
												<td className="border border-gray-200 px-4 py-2 text-gray-700">
													{document.fileName}
												</td>
												<td className="border border-gray-200 px-4 py-2 text-center space-x-4">
													{!document.isApproved ? (
														<button className="approve-btn bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed">
															NOT APPROVE
														</button>
													) : (
														<button
															className="approved-btn bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed"
															disabled
														>
															APPROVED
														</button>
													)}
													<a
														href={document.url}
														download={
															document.fileName
														}
														className="download-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
													>
														DOWNLOAD
													</a>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
			{showAppointmentModal && (
				<ViewAppointmentModal
					onClose={() => setShowAppointmentModal(false)}
					appointmentDate={appointmentDate}
					appointmentNotes={appointmentNotes}
				/>
			)}
			<Copyright />
		</div>
	);
}
