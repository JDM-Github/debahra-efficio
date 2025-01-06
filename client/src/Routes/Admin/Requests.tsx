import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";

import {
	faEye,
	faArchive,
	faCalendar,
	faCalendarAlt,
	faCalendarCheck,
	faCheckCircle,
	faAssistiveListeningSystems,
} from "@fortawesome/free-solid-svg-icons";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Requests.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import AppointmentModal from "../../Component/Appointment.tsx";
import Utility from "../../Functions/Utility.js";

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
		staffId: "",
		staffDescription: "",
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
		// {
		// 	placeholder: "ALL",
		// 	options: [
		// 		{ value: "all", label: "ALL", icon: faCalendarCheck },
		// 		{ value: "yearly", label: "YEARLY", icon: faCalendarAlt },
		// 		{ value: "monthly", label: "MONTHLY", icon: faCalendar },
		// 	],
		// 	onChange: (e) => {
		// 		// if (e == "all") setIsArchived(null);
		// 		// else setIsArchived(e === "archived");
		// 	},
		// },
	];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "VIEW",
			onClick: (id, item) => viewServiceRequest(item),
		},
		{
			icon: faAssistiveListeningSystems,
			className: "done-btn",
			label: "ASSIGN",
			onCondition: (item) => !item.isArchived,
			onClick: (id) => acceptRequest(id),
		},
		{
			icon: faArchive,
			className: "delete-btn",
			label: "ARCHIVED",
			onCondition: (item) => !item.isArchived,
			onClick: (id) => archiveRequest(id),
		},
		{
			icon: faArchive,
			className: "done-btn",
			label: "UNARCHIVED",
			onCondition: (item) => item.isArchived,
			onClick: (id) => archiveRequest(id),
		},
		{
			icon: faArchive,
			className: "delete-btn",
			label: "DELETE",
			onCondition: (item) => item.isArchived,
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
		toast.info("Please assign the employee.");
		alert(id);
		setTargetId(id);
		setIsModalOpen(true);
	};

	const viewServiceRequest = async (item) => {
		setServiceData(item);
		setShowServiceModal(true);
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
