import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faArchive,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestHandler from "../../Functions/RequestHandler.js";
import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Requests.scss";

const headers = [
	"ID",
	"Full Name",
	"Username",
	"Email",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.firstname + " " + item.lastname}</td>
		<td>{item.username}</td>
		<td>{item.email}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

export default function RequestAccount() {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);

	const [isArchived, setIsArchived] = useState<boolean | null>(false);
	const limit = 10;

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
			icon: faCheck,
			className: "done-btn",
			onCondition: (item) => !item.isArchived,
			onClick: (id) => acceptRequest(id),
		},
		{
			icon: faArchive,
			className: "delete-btn",
			onClick: (id) => archiveRequest(id),
		},
	];

	const archiveRequest = async (id) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/set_archived",
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
			loadRequestData();
		} catch (error) {
			toast.error(`An error occurred while archiving data. ${error}`);
		}
	};
	const acceptRequest = async (id) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/accept_request_user",
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
			loadRequestData();
		} catch (error) {
			toast.error(
				`An error occurred while accepting request data. ${error}`
			);
		}
	};
	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get_request",
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
		loadRequestData();
	}, [currPage, isArchived]);

	return (
		<div className="requests">
			<TopBar clickHandler={null} />
			<div className="main-requests">
				<div className="title">Account Requests</div>
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
			<Copyright />
		</div>
	);
}
