import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import {
	faEye,
	faBarsProgress,
	faClipboardCheck,
	faCheckCircle,
	faArchive,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Tabulator from "../../Component/Tabulator.tsx";
import ProgressModal from "../../Component/ProgressModal.tsx";
import "./SCSS/Requests.scss";
import Utility from "../../Functions/Utility.js";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const headers = [
	"ID",
	"Assigned Staff",
	"Service Name",
	// "Price",
	// "Paid Amount",
	"Status",
	"Total Price",
	"Balance",
	"Created At",
	"Actions",
];

const getStatusStyles = (status) => {
	const styles = {
		ONGOING: { backgroundColor: "#ffd700", color: "#fff" },
		ASSIGNED: { backgroundColor: "#00bfff", color: "#fff" },
		VERIFIED: { backgroundColor: "#32cd32", color: "#fff" },
		COMPLETE: { backgroundColor: "#4caf50", color: "#fff" },
		CANCELLED: { backgroundColor: "#ff6347", color: "#fff" },
	};

	return styles[status] || { backgroundColor: "#ff8855", color: "#fff" };
};

const renderRow = (item) => (
	<>
		<td>{item.id}</td>
		<td>
			{item.Employee
				? item.Employee.User.firstname +
				  " " +
				  item.Employee.User.lastname
				: "NOT ASSIGNED"}
		</td>
		<td>{item.Service.serviceName}</td>
		{/* <td style={{ fontWeight: "bold" }}>
			{item.price == null ? "NEGOTIATING" : "₱ " + item.price}
		</td>
		<td style={{ fontWeight: "bold" }}>
			{item.paidAmount == null ? "₱ 0" : "₱ " + item.paidAmount}
		</td> */}
		<td>
			<span
				style={{
					padding: "0.2rem 0.5rem",
					borderRadius: "4px",
					fontWeight: "600",
					...getStatusStyles(item.status),
				}}
			>
				{item.status}
			</span>
		</td>
		<td>{item.price ? item.price : "NOT SET"}</td>
		<td>
			{item.price && item.paidAmount
				? item.price - item.paidAmount
				: "NONE"}
		</td>
		<td className="tabulator-td">{item.createdAt.split("T")[0]}</td>
	</>
);

interface Service {
	uploadedDocument: string;
	uploadedDocuments: {
		fileName: string;
		url: string;
		isApproved: boolean;
	}[];
}

export default function OngoingRequest({ user, changeURL }) {
	const location = useLocation();
	useEffect(() => {
		const successShown = sessionStorage.getItem("successShown");

		if (location.search.includes("message=success") && !successShown) {
			toast.success("Payment was successful!");
			sessionStorage.setItem("successShown", "true");
		}
	}, [location]);

	const [requestData, setRequestData] = useState([]);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	const [showServiceModal, setShowServiceModal] = useState(false);
	const [serviceData, setServiceData] = useState<Service | null>(null);

	const [showProgressModal, setShowProgressModal] = useState(false);
	const [showcertificate, setShowcertificate] = useState(false);
	const [currentCertificate, setCurrentCertificate] = useState<any>(null);
	const [currentRequest, setCurrentRequest] = useState<any>(null);
	const [currentStage, setCurrentStage] = useState(0);

	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const [targetServiceId, setTargetUserId] = useState(null);
	const [price, setPrice] = useState(0);
	const [paidAmount, setPaidAmount] = useState(0);
	const [balance, setBalance] = useState(0);
	const [paymentOption, setPaymentOption] = useState("50%");
	const [paymentAmount, setPaymentAmount] = useState(0);

	const [status, setStatus] = useState("ALL");
	useEffect(() => {
		const savedStatus = sessionStorage.getItem("client-request-status");
		if (savedStatus) {
			setStatus(savedStatus);
		}
	}, []);

	const selectOptions = [
		{
			placeholder: status,
			options: [
				{ value: "ALL", label: "ALL", icon: faCheckCircle },
				{ value: "ONGOING", label: "ONGOING", icon: faCheckCircle },
				{
					value: "ASSIGNED",
					label: "ASSIGNED",
					icon: faClipboardCheck,
				},
				{ value: "VERIFIED", label: "VERIFIED", icon: faCheckCircle },
				{ value: "APPOINTED", label: "APPOINTED", icon: faCheckCircle },
				{ value: "COMPLETED", label: "COMPLETED", icon: faArchive },
				{ value: "CANCELLED", label: "CANCELLED", icon: faTimesCircle },
			],
			onChange: (e) => {
				setStatus(e);
				sessionStorage.setItem("client-request-status", e);
			},
		},
	];

	const actions = [
		{
			icon: faEye,
			className: "view-btn",
			label: "VIEW",
			onClick: (id, item) => viewServiceRequest(item),
		},
		{
			icon: faBarsProgress,
			className: "done-btn",
			label: "PROGRESS",
			onCondition: (item) => item.status == "VERIFIED",
			onClick: (id, item) => openProgressModal(item),
		},
		{
			icon: faBarsProgress,
			className: "done-btn",
			label: "PAY",
			onCondition: (item) =>
				(item.status == "VERIFIED" || item.status == "APPOINTED") &&
				item.price &&
				item.paidAmount &&
				item.price > item.paidAmount,
			onClick: (id, item) => {
				const nprice = parseFloat(item.price);
				const npaidAmount = parseFloat(item.paidAmount);

				setTargetUserId(item.id);
				setPrice(nprice);
				setPaidAmount(nprice);
				setBalance(nprice - npaidAmount);
				setShowPaymentModal(true);

				if (npaidAmount === 0) {
					const calculatedAmount = nprice / 2;
					setPaymentAmount(calculatedAmount);
				}
			},
		},
		{
			icon: faBarsProgress,
			className: "done-btn",
			label: "CERTIFICATE",
			onCondition: (item) => item.status == "COMPLETED",
			onClick: (id, item) => viewCertificate(item),
		},
	];

	const viewCertificate = async (item) => {
		setShowcertificate(true);
		setCurrentCertificate(item);
	};

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
				{ id: user.id, currPage, limit, status }
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
	}, [currPage, status]);

	const createPaymentSession = async () => {
		try {
			const response = await RequestHandler.handleRequest(
				"post",
				"create-payment",
				{
					amount: paymentAmount,
					targetServiceId,
				}
			);
			if (response.redirectUrl) {
				sessionStorage.removeItem("successShown");
				window.location.href = response.redirectUrl;
			} else {
				console.error("Payment URL not found.");
				toast.error("Failed	to get the payment link.");
			}
		} catch (error) {
			console.error("Error creating payment session:", error);
			toast.error("Failed	to create payment session.");
		}
	};

	return (
		<div className="requests">
			<TopBar clickHandler={() => changeURL("profile")} />
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
					searchableHeaders={["id"]}
				/>
			</div>

			{showProgressModal && currentRequest && (
				<ProgressModal
					currentStage={currentStage}
					progress={currentRequest.progress}
					onClose={closeProgressModal}
				/>
			)}

			{showServiceModal && serviceData && (
				<div className="serviceModal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="modal-content bg-white rounded-lg shadow-lg overflow-hidden min-w-[50vw] w-full min-h-[80vh] max-h-[80vh] p-6">
						<div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
							<h2 className="text-xl font-semibold border-l-4 border-green-600 pl-4">
								Uploaded Documents
							</h2>
							<button>
								{serviceData.uploadedDocument && (
									<a
										href={serviceData.uploadedDocument}
										download={serviceData.uploadedDocument}
										className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
									>
										DOWNLOAD
									</a>
								)}
							</button>
							<span
								className="text-5xl text-gray-200 cursor-pointer hover:text-red-500"
								onClick={() => setShowServiceModal(false)}
							>
								&times;
							</span>
						</div>

						<div className="overflow-y-auto">
							<table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
								<thead>
									<tr className="bg-green-100">
										<th className="border border-gray-200 px-4 py-2 text-left text-gray-800 font-semibold">
											File Name
										</th>
										<th className="border border-gray-200 px-4 py-2 text-gray-800 font-semibold">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{serviceData.uploadedDocuments.map(
										(document, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50 transition-all duration-200"
											>
												<td className="border border-gray-200 px-4 py-2 text-gray-700">
													{document.fileName}
												</td>
												<td className="border border-gray-200 px-4 py-2 text-center space-x-4">
													{!document.isApproved ? (
														<button className="approve-btn bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed">
															NOT APPROVE
														</button>
													) : (
														<button
															className="approved-btn bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed"
															disabled
														>
															APPROVED
														</button>
													)}
													<a
														href={document.url}
														download={
															document.fileName
														}
														className="download-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
													>
														DOWNLOAD
													</a>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{showPaymentModal && (
				<div className="paymentModal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="modal-content bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full p-6">
						<div className="flex justify-between items-center border-b pb-4 mb-4">
							<h2 className="text-xl font-semibold">Payment</h2>
							<span
								className="text-3xl text-gray-400 cursor-pointer hover:text-red-500"
								onClick={() => setShowPaymentModal(false)}
							>
								&times;
							</span>
						</div>

						<div className="space-y-4">
							<div className="flex justify-between text-lg">
								<span className="font-semibold">
									Total Price:
								</span>
								<span>₱{price.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-lg">
								<span className="font-semibold">Balance:</span>
								<span>₱{balance.toFixed(2)}</span>
							</div>

							{paidAmount === 0 || balance === price ? (
								<div>
									<label className="block font-medium mb-2">
										Payment Option:
									</label>
									<select
										value={paymentOption}
										onChange={(e) => {
											setPaymentOption(e.target.value);
											const calculatedAmount =
												e.target.value === "50%"
													? price / 2
													: price;
											setPaymentAmount(calculatedAmount);
										}}
										className="w-full border border-gray-300 rounded px-3 py-2"
									>
										<option value="50%">
											50% Downpayment (₱
											{(price / 2).toFixed(2)})
										</option>
										<option value="100%">
											Full Payment (₱{price.toFixed(2)})
										</option>
									</select>
								</div>
							) : (
								<div>
									<label className="block font-medium mb-2">
										Enter Payment Amount (Max: ₱
										{balance.toFixed(2)}):
									</label>
									<input
										type="number"
										max={balance}
										min="1"
										value={paymentAmount}
										onChange={(e: any) => {
											const value = Math.min(
												Math.max(e.target.value, 1),
												balance
											);
											setPaymentAmount(value);
										}}
										className="w-full border border-gray-300 rounded px-3 py-2"
										placeholder="Enter amount to pay"
									/>
								</div>
							)}

							<button
								onClick={createPaymentSession}
								className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4"
							>
								Proceed to Pay
							</button>
						</div>
					</div>
				</div>
			)}

			{showcertificate && currentCertificate && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl animate-fadeIn">
						{/* Header */}
						<div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-green-700 text-white">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Certificate
							</h2>
							<button
								onClick={() => setShowcertificate(false)}
								className="text-3xl hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
								aria-label="Close"
							>
								&times;
							</button>
						</div>

						{/* Body */}
						<div className="px-6 py-6 space-y-4 overflow-y-auto max-h-[70vh]">
							<p className="text-sm text-gray-500">
								<strong>Certificate Number:</strong>{" "}
								{currentCertificate.certificateNumber}
							</p>
							<p className="text-sm text-gray-500">
								<strong>Issued Date:</strong>{" "}
								{new Date(
									currentCertificate.certificateIssuedDate
								).toLocaleString()}
							</p>

							<div className="border border-green-300 rounded-lg p-4 bg-green-50">
								<h3 className="text-lg font-semibold text-green-800 mb-2">
									{currentCertificate.certificateName}
								</h3>
								<p className="text-sm text-gray-700">
									This certifies that{" "}
									<strong>
										{currentCertificate.certificateIssuedTo}
									</strong>{" "}
									has been issued this certificate.
								</p>
								<ul className="list-disc list-inside mt-2 text-gray-700">
									<li>
										<strong>Issued By:</strong>{" "}
										{currentCertificate.certificateIssuedBy}
									</li>
								</ul>
							</div>

							<p className="text-sm text-gray-600">
								Please keep this certificate for your records.
							</p>
						</div>

						{/* Footer */}
						<div className="flex justify-end items-center bg-gray-50 px-6 py-4">
							<button
								onClick={() => setShowcertificate(false)}
								className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			<Copyright />
		</div>
	);
}
