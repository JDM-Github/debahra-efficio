import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import {
	faEye,
	faBarsProgress,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import ProgressModal from "../../Component/ProgressModal.tsx";
import "./SCSS/Requests.scss";
import Utility from "../../Functions/Utility.js";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import ProfileModal from "../../Component/ProfileModal.tsx";

const headers = [
	"ID",
	"Client ID",
	"Client Name",
	"Service Name",
	"Started At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.User.id}</td>
		<td>{item.User.firstname + " " + item.User.lastname}</td>
		<td>{item.Service.serviceName}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

interface User {
	profileImg: string;
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	location: string;
}

export default function HandledUsers({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;
	const selectOptions = [];

	const [userTarget, setUserTarget] = useState<User | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			onClick: (id, item) => openModal(item),
		},
	];
	const openModal = (target) => {
		const user = {
			profileImg: target.User.profileImg,
			username: target.User.username,
			firstname: target.User.firstname,
			lastname: target.User.lastname,
			email: target.User.email,
			location: target.User.location,
		};
		setUserTarget(user);
		setIsModalOpen(true);
	};
	const closeModal = () => setIsModalOpen(false);

	const loadAllRequests = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_all_assigned_user",
				{
					id: user.id,
					currPage,
					limit,
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
	}, [currPage]);

	return (
		<div className="requests">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-requests">
				<div className="title">Handled Users</div>
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
			<Copyright />
			{isModalOpen && userTarget && (
				<ProfileModal user={userTarget} onClose={closeModal} />
			)}
		</div>
	);
}
