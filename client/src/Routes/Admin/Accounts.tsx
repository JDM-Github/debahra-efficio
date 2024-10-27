import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAsterisk,
	faEdit,
	faTrash,
	faPlus,
	faFilter,
	faEye,
} from "@fortawesome/free-solid-svg-icons";

import { faUser, faStar, faGem } from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Accounts.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast, ToastContainer } from "react-toastify";
import ProfileModal from "../../Component/ProfileModal.tsx";

const accountsData = [
	{
		id: 1,
		companyName: "Company 1",
		username: "Unknown 1",
		phone: "123-456-7890",
		email: "unknown1@example.com",
		address: "Test Address 1, City 1",
		member: "GOLD MEMBER",
	},
];

const headers = [
	"ID",
	"Full Name",
	"Username",
	"Email",
	"Address",
	"Member",
	"Created At",
	"Actions",
];

const buttons = [
	{
		icon: faPlus,
		label: "Add Account",
		className: "add-account",
		onClick: () => console.log("Add clicked"),
	},
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.firstname + " " + item.lastname}</td>
		<td>{item.username}</td>
		<td>{item.email}</td>
		<td>{item.location}</td>
		<td>{item.membership}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

export default function Accounts() {
	const [member, setMember] = useState("");

	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [userId, setUserId] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const selectOptions = [
		{
			placeholder: "Select Membership...",
			options: [
				{ value: "all", label: "ALL", icon: faAsterisk },
				{ value: "mmem", label: "MEMBER", icon: faUser },
				{ value: "gmem", label: "GOLD MEMBER", icon: faStar },
				{ value: "dmem", label: "DIAMOND MEMBER", icon: faGem },
			],
			onChange: (value) => setMember(value),
		},
	];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			onClick: (id) => openModal(id),
		},
		{
			icon: faTrash,
			className: "delete-btn",
			onClick: (id) => console.log(`Delete ID: ${id}`),
		},
	];

	const openModal = (id) => {
		setUserId(id);
		setIsModalOpen(true);
	};
	const closeModal = () => setIsModalOpen(false);

	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get_accounts",
				{ currPage, limit }
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
		loadRequestData();
	}, [currPage]);

	return (
		<div className="accounts">
			<TopBar clickHandler={null} />
			<div className="main-accounts">
				<div className="title">Accounts</div>
				<Tabulator
					data={requestData}
					headers={headers}
					renderRow={renderRow}
					actions={actions}
					buttons={buttons}
					selects={selectOptions}
					currentPage={currPage}
					setCurrentPage={setCurrPage}
					itemsPerPage={limit}
					total={total}
				/>
			</div>
			<Copyright />
			{isModalOpen && userId && (
				<ProfileModal id={userId} onClose={closeModal} />
			)}
			<ToastContainer />
		</div>
	);
}
