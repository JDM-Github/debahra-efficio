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

export default function Appointment({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	interface Service {
		uploadedDocument: string;
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
			label: "APPOINTMENT",
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
				/>
			</div>
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
