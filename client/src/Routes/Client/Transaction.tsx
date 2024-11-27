import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Layout.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import TransactionViewModal from "../../Component/TransactionViewModal.tsx";

const headers = [
	"ID",
	"Full Name",
	"Email",
	"Assigned Staff",
	"Service Name",
	"Amount",
	"Type",
	"Created At",
	"Actions",
];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.User.firstname + " " + item.User.lastname}</td>
		<td>{item.User.email}</td>
		<td>
			{item.Employee.User.firstname + " " + item.Employee.User.lastname}
		</td>
		<td>{item.Request.Service.serviceName}</td>
		<td>{item.amount}</td>
		<td>{item.typeOfTransaction}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

export default function Transaction({ user, changeURL }) {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
	const [transactionDetail, setTransactionDetail] = useState(null);

	const handleViewTransaction = (item) => {
		setTransactionDetail(item);
		setTransactionModalOpen(true);
	};

	const closeModal = () => {
		setTransactionDetail(null);
		setTransactionModalOpen(false);
	};

	const buttons = [];
	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "View",
			onClick: (id, item) => handleViewTransaction(item),
		},
	];

	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_all_transaction_user",
				{ id: user.id, currPage, limit }
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
		<div className="layout-debara">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-layout-debara">
				<div className="title">Transactions</div>
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
				/>
			</div>
			<Copyright />
			{isTransactionModalOpen && (
				<TransactionViewModal
					isOpen={isTransactionModalOpen}
					onClose={closeModal}
					transactionDetail={transactionDetail}
				/>
			)}
		</div>
	);
}
