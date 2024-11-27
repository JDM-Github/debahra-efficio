import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import { faEye, faBarsProgress } from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import ProgressModal from "../../Component/ProgressModal.tsx";
import "./SCSS/Requests.scss";
import Utility from "../../Functions/Utility.js";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

const headers = [
	"ID",
	"Assigned Staff",
	"Service Name",
	"Status",
	"Cancelled At",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>
			{item.Employee.User.firstname + " " + item.Employee.User.lastname}
		</td>
		<td>{item.Service.serviceName}</td>
		<td>
			<span
				style={{
					padding: "0.2rem 0.5rem",
					borderRadius: "4px",
					backgroundColor: "#ff4422",
					color: "#fff",
					fontWeight: "600",
				}}
			>
				{item.status}
			</span>
		</td>
		<td className="tabulator-td">{item.cancelledAt.split("T")[0]}</td>
		<td className="tabulator-td">{item.createdAt.split("T")[0]}</td>
	</>
);

interface Service {
	uploadedDocument: string;
}

export default function CancelledRequest({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);

	const [showProgressModal, setShowProgressModal] = useState(false);
	const [currentRequest, setCurrentRequest] = useState(null);
	const [currentStage, setCurrentStage] = useState(0);
	const selectOptions = [];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "DOCUMENT",
			onClick: (id, item) => viewServiceRequest(item),
		},
		{
			icon: faBarsProgress,
			className: "done-btn",
			label: "PROGRESS",
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
				{ id: user.id, currPage, limit, status: "CANCELLED" }
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
				<div className="title">Cancelled Requests</div>
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

			{showProgressModal && currentRequest && (
				<ProgressModal
					currentStage={currentStage}
					onClose={closeProgressModal}
				/>
			)}

			{showServiceModal && serviceData && (
				<div className="serviceModal">
					{serviceData.uploadedDocument &&
						Utility.isImage(
							Utility.getFileExtension(
								serviceData.uploadedDocument
							)
						) && (
							<img
								src={serviceData.uploadedDocument}
								className="uploaded-img"
								alt="Uploaded Preview"
							/>
						)}
					{serviceData.uploadedDocument &&
						Utility.isApplicationPDF(
							Utility.getFileExtension(
								serviceData.uploadedDocument
							)
						) && (
							<iframe
								src={serviceData.uploadedDocument}
								className="uploaded-img"
								title="Uploaded PDF Preview"
							/>
						)}
					<div
						className="close"
						onClick={() => setShowServiceModal(false)}
					>
						&times;
					</div>
				</div>
			)}
			<Copyright />
		</div>
	);
}
