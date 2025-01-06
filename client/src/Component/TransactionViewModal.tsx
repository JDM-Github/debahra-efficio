import React from "react";
import "./SCSS/TransactionViewModal.scss";

const TransactionViewModal = ({ isOpen, onClose, transactionDetail }) => {
	if (!isOpen || !transactionDetail) return null;

	const {
		id,
		User,
		Employee,
		Request,
		amount,
		typeOfTransaction,
		createdAt,
	} = transactionDetail;

	return (
		<div className="transaction-view-modal-overlay">
			<div className="transaction-view-modal">
				<h2>Transaction Details</h2>
				<div className="modal-view-content">
					<p>
						<strong>ID:</strong> {id}
					</p>
					<p>
						<strong>Full Name:</strong> {User?.firstname}{" "}
						{User?.lastname}
					</p>
					<p>
						<strong>Email:</strong> {User?.email}
					</p>
					{/* <p>
						<strong>Assigned Staff:</strong>{" "}
						{Employee?.User?.firstname} {Employee?.User?.lastname}
					</p> */}
					<p>
						<strong>Service Name:</strong>{" "}
						{Request?.Service?.serviceName}
					</p>
					<p>
						<strong>Amount:</strong> ₱{amount}
					</p>
					<p>
						<strong>Type of Transaction:</strong>{" "}
						{typeOfTransaction}
					</p>
					<p>
						<strong>Created At:</strong> {createdAt.split("T")[0]}
					</p>
				</div>
				<button className="close-modal-view-button" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default TransactionViewModal;
