import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import {
	faEye,
	faBarsProgress,
	faCheckCircle,
	faClipboardCheck,
	faArchive,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import ProgressModal from "../../Component/ProgressModal.tsx";
import "./SCSS/Requests.scss";
import Utility from "../../Functions/Utility.js";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

const headers = [
	"ID",
	"Client ID",
	"Client Name",
	"Service Name",
	"Status",
	"Total Price",
	"Balance",
	"Created At",
	"Actions",
];

const getStatusStyles = (status) => {
	const styles = {
		ONGOING: { backgroundColor: "#ffd700", color: "#fff" },
		ASSIGNED: { backgroundColor: "#00bfff", color: "#fff" },
		VERIFIED: { backgroundColor: "#32cd32", color: "#fff" },
		COMPLETE: { backgroundColor: "#4caf50", color: "#fff" },
		CANCELLED: { backgroundColor: "#ff6347", color: "#fff" },
	};

	return styles[status] || { backgroundColor: "#ff8855", color: "#fff" };
};

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.User.id}</td>
		<td>{item.User.firstname + " " + item.User.lastname}</td>
		<td>{item.Service.serviceName}</td>
		<td>
			<span
				style={{
					padding: "0.2rem 0.5rem",
					borderRadius: "4px",
					fontWeight: "600",
					...getStatusStyles(item.status),
				}}
			>
				{item.status}
			</span>
		</td>
		<td>{item.price ? item.price : "NOT SET"}</td>
		<td>
			{item.price && item.paidAmount
				? item.price - item.paidAmount
				: "NONE"}
		</td>
		<td className="tabulator-td">{item.createdAt.split("T")[0]}</td>
	</>
);

interface Service {
	id: string;
	uploadedDocument: string;
	uploadedDocuments: {
		fileName: string;
		url: string;
		isApproved: boolean;
	}[];
}

export default function OngoingRequest({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);

	const [showProgressModal, setShowProgressModal] = useState(false);
	const [currentRequest, setCurrentRequest] = useState<any>(null);
	const [currentStage, setCurrentStage] = useState(0);

	const [status, setStatus] = useState("ASSIGNED");
		useEffect(() => {
			const savedStatus = sessionStorage.getItem("staff-request-status");
			if (savedStatus) {
				setStatus(savedStatus);
			}
		}, []);
	const selectOptions = [
		{
			placeholder: status,
			options: [
				{
					value: "ASSIGNED",
					label: "ASSIGNED",
					icon: faClipboardCheck,
				},
				{ value: "VERIFIED", label: "VERIFIED", icon: faCheckCircle },
				{ value: "APPOINTED", label: "APPOINTED", icon: faCheckCircle },
				{ value: "COMPLETED", label: "COMPLETED", icon: faArchive },
				{ value: "CANCELLED", label: "CANCELLED", icon: faTimesCircle },
			],
			onChange: (e) => {
				setStatus(e);
				sessionStorage.setItem("staff-request-status", e);
			},
		},
	];

	const approveRequest = async (id, staffId) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/accept_request",
				{ id, staffId }
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				toast.success(data.message);
			}
			loadAllRequests();
		} catch (error) {
			toast.error(
				`An error occurred while accepting request data. ${error}`
			);
		}
	};

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "VIEW",
			onClick: (id, item) => viewServiceRequest(item),
		},
		{
			icon: faCheckCircle,
			className: "done-btn",
			label: "APPROVED",
			onCondition: (item) => item.status == "ASSIGNED",
			onClick: (id, item) =>
				approveRequest(item.id, item.Employee.User.id),
		},
		{
			icon: faBarsProgress,
			className: "done-btn",
			label: "PROGRESS",
			onCondition: (item) => item.status != "ASSIGNED",
			onClick: (id, item) => openProgressModal(item),
		},
	];

	const viewServiceRequest = async (item) => {
		setServiceData(item);
		setShowServiceModal(true);
	};

	const openProgressModal = (item) => {
		setCurrentRequest(item);
		setCurrentStage(item.currentStage || 0);
		setShowProgressModal(true);
	};

	const closeProgressModal = () => {
		setShowProgressModal(false);
		setCurrentRequest(null);
		setCurrentStage(0);
	};

	const loadAllRequests = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_request_ongoing",
				{
					assignedEmployee: user.id,
					currPage,
					limit,
					status,
				}
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
	useEffect(() => {
		loadAllRequests();
	}, [currPage, status]);

	const handleApprove = async (index) => {
		if (serviceData == null) {
			return;
		}
		const updatedDocuments = [...serviceData.uploadedDocuments];
		updatedDocuments[index].isApproved =
			!updatedDocuments[index].isApproved;

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/update_request",
				{ id: serviceData.id, documents: updatedDocuments }
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				setServiceData({
					...serviceData,
					uploadedDocuments: updatedDocuments,
				});
			}
		} catch (error) {
			toast.error(
				`An error occurred while approving request data. ${error}`
			);
		}
	};

	return (
		<div className="requests">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-requests">
				<div className="title">Requests</div>
				<Tabulator
					data={requestData}
					headers={headers}
					renderRow={renderRow}
					actions={actions}
					buttons={[]}
					selects={selectOptions}
					currentPage={currPage}
					setCurrentPage={setCurrPage}
					itemsPerPage={limit}
					total={total}
					searchableHeaders={["id"]}
				/>
			</div>

			{showProgressModal && currentRequest && (
				<ProgressModal
					currentStage={currentStage}
					progress={currentRequest.progress}
					onClose={closeProgressModal}
				/>
			)}

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
													{status == "ASSIGNED" &&
														(document.isApproved ? (
															<button
																className="approve-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
																onClick={() =>
																	handleApprove(
																		index
																	)
																}
															>
																APPROVED
															</button>
														) : (
															<button
																className="approved-btn bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md "
																onClick={() =>
																	handleApprove(
																		index
																	)
																}
															>
																NOT APPROVED
															</button>
														))}

													{status != "ASSIGNED" &&
														(!document.isApproved ? (
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
														))}
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
			<Copyright />
		</div>
	);
}
