import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";

import Tabulator from "../../Component/Tabulator.tsx";
import "./SCSS/Accounts.scss";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

const headers = ["ID", "Message", "Created At"];

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>{item.message}</td>
		<td>{item.createdAt.split("T")[0]}</td>
	</>
);

export default function ActivityLog() {
	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const buttons = [];
	const actions = [];

	const loadRequestData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/get_all_activity",
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
				<div className="title">Activity Logs</div>
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
		</div>
	);
}
