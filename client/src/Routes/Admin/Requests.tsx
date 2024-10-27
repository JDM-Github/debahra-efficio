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
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Requests.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast, ToastContainer } from "react-toastify";
import AppointmentModal from "../../Component/Appointment.tsx";

const headers = [
	"ID",
	"User ID",
	"Full Name",
	"Service Name",
	"Status",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.User.id}</td>
		<td>{item.User.firstname + " " + item.User.lastname}</td>
		<td>{item.Service.serviceName}</td>
		<td>{item.status}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

const getFileExtension = (url) => {
	const regex = /(?:\.([^.]+))?$/;
	const match = url.match(regex);
	return match ? match[1] : "";
};

const isImage = (extension) => {
	const imageExtensions = ["jpg", "jpeg", "png", "gif"];
	return imageExtensions.includes(extension.toLowerCase());
};

const isApplicationPDF = (extension) => {
	return extension.toLowerCase() === "pdf";
};

export default function Requests() {
	interface Service {
		uploadedDocument: string;
	}
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);
	const [isArchived, setIsArchived] = useState<boolean | null>(false);

	const [targetId, setTargetId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [appointmentData, setAppointmentData] = useState({
		date: "",
		people: "",
		notes: "",
	});

	const handleCreate = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/accept_request",
				{ id: targetId, appointmentData }
			);
			if (data.success === false) {
				toast.error(
					data.message ||
						"Error occurred. Please check your credentials."
				);
			} else {
				toast.success(data.message);
				setIsModalOpen(false);
			}
			loadAllRequests();
		} catch (error) {
			toast.error(
				`An error occurred while accepting request data. ${error}`
			);
		}
	};

	const handleCancel = () => {
		toast.info("Appointment canceled!");
		setIsModalOpen(false);
	};

	const selectOptions = [
		{
			placeholder: "ACTIVE",
			options: [
				{ value: "unarchived", label: "ACTIVE", icon: faCheckCircle },
				{ value: "archived", label: "ARCHIVED", icon: faArchive },
			],
			onChange: (e) => {
				if (e == "all") setIsArchived(null);
				else setIsArchived(e === "archived");
			},
		},
	];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "VIEW",
			onClick: (id) => viewServiceRequest(id),
		},
		{
			icon: faCheck,
			className: "done-btn",
			label: "ACCEPT",
			onCondition: (item) => !item.isArchived,
			onClick: (id) => acceptRequest(id),
		},
		{
			icon: faArchive,
			className: "delete-btn",
			label: "ARCHIVED",
			onClick: (id) => archiveRequest(id),
		},
	];

	const archiveRequest = async (id) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/set_archived",
				{ id }
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
			toast.error(`An error occurred while archiving data. ${error}`);
		}
	};

	const acceptRequest = async (id) => {
		toast.info("Please setup a appointment.");
		setTargetId(id);
		setIsModalOpen(true);
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

	const loadAllRequests = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_request",
				{ currPage, limit, isArchived }
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
	}, [currPage, isArchived]);

	return (
		<div className="requests">
			<TopBar clickHandler={null} />
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
				/>
			</div>
			<ToastContainer />
			{isModalOpen && (
				<AppointmentModal
					onClose={() => setIsModalOpen(false)}
					appointmentData={appointmentData}
					onCreate={handleCreate}
					onCancel={handleCancel}
					setAppointmentData={setAppointmentData}
				/>
			)}
			{showServiceModal && serviceData && (
				<div className="serviceModal">
					{serviceData.uploadedDocument &&
						isImage(
							getFileExtension(serviceData.uploadedDocument)
						) && (
							<img
								src={serviceData.uploadedDocument}
								className="uploaded-img"
								alt="Uploaded Preview"
							/>
						)}
					{serviceData.uploadedDocument &&
						isApplicationPDF(
							getFileExtension(serviceData.uploadedDocument)
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
