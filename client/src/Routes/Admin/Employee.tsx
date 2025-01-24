import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import { faTrash, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Accounts.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import ProfileModal from "../../Component/ProfileModal.tsx";
import AddAccountModal from "../../Component/AddAccountModal.tsx";

const headers = [
	"ID",
	"Full Name",
	"Username",
	"Email",
	"Address",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.firstname + " " + item.lastname}</td>
		<td>{item.username}</td>
		<td>{item.email}</td>
		<td>{item.location}</td>
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

export default function Employees() {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [userTarget, setUserTarget] = useState<User | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const buttons = [
		{
			icon: faPlus,
			label: "Add Account",
			className: "add-account",
			onClick: () => setIsAddModalOpen(true),
		},
	];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			onClick: (id, item) => openModal(item),
		},
		{
			icon: faTrash,
			className: "delete-btn",
			onClick: (id) => deleteItem(id),
		},
	];

	const openModal = (target) => {
		setUserTarget(target);
		setIsModalOpen(true);
	};
	const closeAddModal = () => setIsAddModalOpen(false);
	const closeModal = () => setIsModalOpen(false);
	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get_employee",
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
	const deleteItem = async (id) => {
		try {
			const confirmation = window.confirm(
				"Are you sure you want to delete this item?"
			);
			if (!confirmation) return;
			const response = await RequestHandler.handleRequest(
				"post",
				"users/deleteEmployee",
				{ id }
			);
			if (response.success) {
				toast.success("Item deleted successfully");
				setRequestData(requestData.filter((item: any) => item.id !== id));
			} else {
				toast.error(response.message || "Failed to delete item");
			}
		} catch (error) {
			toast.error(`An error occurred while deleting the item: ${error}`);
		}
	};
	useEffect(() => {
		loadRequestData();
	}, [currPage]);

	return (
		<div className="accounts">
			<TopBar clickHandler={null} />
			<div className="main-accounts">
				<div className="title">Employee</div>
				<Tabulator
					data={requestData}
					headers={headers}
					renderRow={renderRow}
					actions={actions}
					buttons={buttons}
					selects={[]}
					currentPage={currPage}
					setCurrentPage={setCurrPage}
					itemsPerPage={limit}
					total={total}
					searchableHeaders={["id"]}
				/>
			</div>
			<Copyright />
			{isModalOpen && userTarget && (
				<ProfileModal user={userTarget} onClose={closeModal} />
			)}
			{isAddModalOpen && (
				<AddAccountModal
					onClose={closeAddModal}
					onAccountAdded={loadRequestData}
				/>
			)}
		</div>
	);
}
