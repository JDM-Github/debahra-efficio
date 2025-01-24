import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Requests.scss";
import Utility from "../../Functions/Utility.js";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const headers = ["ID", "Service Name", "Status", "Created At", "Actions"];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.Service.serviceName}</td>
		<td>
			<span
				style={{
					padding: "0.2rem 0.5rem",
					borderRadius: "4px",
					backgroundColor: "#ff8855",
					color: "#fff",
					fontWeight: "600",
				}}
			>
				{item.status}
			</span>
		</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

interface Service {
	uploadedDocument: string;
	uploadedDocuments: { fileName: string; url: string; isApproved: boolean }[];
}

export default function PendingRequest({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);

	const selectOptions = [];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "DOCUMENT",
			onClick: (id, item) => viewServiceRequest(item),
		},
	];

	const viewServiceRequest = async (item) => {
		setServiceData(item);
		setShowServiceModal(true);
	};

	const loadAllRequests = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_request_ongoing",
				{ id: user.id, currPage, limit, isVerified: false }
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
	}, [currPage]);

	return (
		<div className="requests">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-requests">
				<div className="title">Pending Requests</div>
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
