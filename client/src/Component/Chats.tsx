import React, { ReactElement, useEffect, useRef, useState } from "react";
import "./Chats.scss";

import RequestHandler from "../Functions/RequestHandler.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faReply,
	faHeart,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TransactionModal from "./TransactionModal.tsx";
import AddProgressStepModal from "./AddProgress.tsx";

function Message({
	user,
	assignedEmployee,
	request,
	text,
	isSent,
	replyText,
	replyTo,
	onReply,
	onDelete,
	chatPartner,
	handleOpenModal,
	updateMessage,
}) {
	const isOffer =
		text.startsWith("::downpayment::") && text.includes("::totalprice::");
	const offerDetails = isOffer
		? text.match(/::downpayment::"(.+?)",::totalprice::"(\d+?)"/)
		: null;
	const downpayment = offerDetails ? offerDetails[1] : null;
	const totalprice = offerDetails ? offerDetails[2] : null;

	// TRANSACTION
	const isTransactionOffer =
		text.startsWith("::referencenumber::") && text.includes("::proof::");
	const transactionDetails = isTransactionOffer
		? text.match(
				/::referencenumber::"(.+?)",::proof::"(.+?)",::amount::"(.+?)",::type::"(.+?)",::totalprice::"(.+?)",::downpayment::"(.+?)"/
		  )
		: null;

	const referencenumber = transactionDetails ? transactionDetails[1] : null;
	const proof = transactionDetails ? transactionDetails[2] : null;
	const amount = transactionDetails ? transactionDetails[3] : null;
	const typeTransaction = transactionDetails ? transactionDetails[4] : null;
	const transactionTotal = transactionDetails ? transactionDetails[5] : null;
	const [alreadyAccepted, setAlreadyAccepted] = useState(false);

	const checkConfirm = async () => {
		if (isTransactionOffer)
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"request/check-confirm-transaction",
					{
						referenceNumber: referencenumber,
					}
				);
				if (data.success) {
					setAlreadyAccepted(data.value);
				} else {
					return;
				}
			} catch (error) {
				return;
			}
	};

	const addToTransaction = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/add-transaction",
				{
					userId: user,
					assignedEmployee,
					requestId: request.id,
					typeOfTransaction: typeTransaction,
					referenceNumber: referencenumber,
					uploadedProof: proof,
					amount,
					totalPrice:
						request.price === null
							? transactionTotal
							: request.price,
				}
			);
			if (data.success) {
				toast.success(
					"Successfully confirm the transaction. It will not be recorded"
				);
				updateMessage();
			} else {
				toast.error(data.message);
				return;
			}
		} catch (error) {
			toast.error("Error adding the transaction");
			return;
		}
	};
	useEffect(() => {
		checkConfirm();
	}, []);
	return (
		<>
			{replyText && replyText !== "" ? (
				<>
					<div className={`reply-to ${isSent ? "sent" : "received"}`}>
						{isSent ? "You" : chatPartner} replied to {replyTo}
					</div>
					<div
						className={`reply-message ${
							isSent ? "sent" : "received"
						}`}
					>
						{replyText}
					</div>
				</>
			) : null}
			<div
				className={`message ${isSent ? "sent" : "received"} ${
					isOffer ? "offer-message" : ""
				}`}
			>
				{isOffer ? (
					<>
						<div className="offer-message">
							<div className="offer-details">
								<div className="price-info">
									<span className="price-icon">💵</span>
									<strong>Down Payment:</strong> ₱{" "}
									{downpayment}
								</div>
								<div className="price-info">
									<span className="price-icon">🛒</span>
									<strong>Total Price:</strong> ₱ {totalprice}
								</div>
							</div>
							{!isSent && request && request.price == null && (
								<button
									className="take-offer-button"
									onClick={() =>
										handleOpenModal(downpayment, totalprice)
									}
								>
									Take Offer
								</button>
							)}
						</div>
					</>
				) : isTransactionOffer ? (
					<>
						<div className="offer-message">
							<div className="offer-details">
								<div
									style={{ fontSize: "20px" }}
									className="price-info"
								>
									<b>
										{typeTransaction === "downpayment"
											? "DOWNPAYMENT TRANSACTION"
											: typeTransaction === "fullpayment"
											? "FULL PAYMENT TRANSACTION"
											: typeTransaction ===
											  "partialpayment"
											? "PARTIAL PAYMENT TRANSACTION"
											: "SELECT A TRANSACTION TYPE"}
									</b>
								</div>
								<div className="price-info">
									<strong>Reference Number:</strong>{" "}
									{referencenumber}
								</div>
								<div className="price-info">
									<strong>Amount:</strong> ₱ {amount}
								</div>
								<div className="price-info">
									<img src={proof} />
								</div>
							</div>
							{!isSent && !alreadyAccepted && (
								<button
									className="take-offer-button"
									onClick={addToTransaction}
								>
									Confirm Transaction
								</button>
							)}
						</div>
					</>
				) : (
					<>{text}</>
				)}
				<div className="message-buttons">
					<button onClick={onReply}>
						<FontAwesomeIcon icon={faReply} />
					</button>
					{/* <button onClick={onDelete}>
						<FontAwesomeIcon icon={faTrashAlt} />
					</button> */}
				</div>
			</div>
		</>
	);
}

interface Request {
	Service: {
		serviceName: string;
	};
	id: string;
	userId: string;
	status: string;
	price: number;
	paidAmount: number;
}
type ChatWindowProps = {
	chatPartner: any;
	request?: Request | null;
	partnerId?: string;
	staffId?: string;
};


const AppointmentModal = ({ isOpen, onClose, onSave }) => {
	const [appointmentDate, setAppointmentDate] = useState(Date.now());
	const [appointmentNotes, setAppointmentNotes] = useState("");

	if (!isOpen) return null;

	const handleSave = (e) => {
		e.preventDefault();
		onSave({ appointmentDate, appointmentNotes });
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">
					Schedule Appointment
				</h2>
				<form onSubmit={handleSave}>

					<div className="mb-4">
						<label
							htmlFor="appointmentNotes"
							className="block text-sm font-medium text-gray-700"
						>
							Notes
						</label>
						<textarea
							id="appointmentNotes"
							name="appointmentNotes"
							rows={4}
							value={appointmentNotes}
							onChange={(e) =>
								setAppointmentNotes(e.target.value)
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
							placeholder="Add any notes about the appointment..."
						></textarea>
					</div>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-blue-700"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default function ChatWindow({
	chatPartner,
	request = null,
	partnerId = "",
	staffId = "",
}: ChatWindowProps) {
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("users") === null) {
			sessionStorage.setItem("error-message", "Invalid User Token");
			navigate("/");
		}
		sessionStorage.removeItem("error-message");
	}, []);
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	const staffTarget = staffId != "" ? "staff" + staffId : "staff" + user.id;

	const [transactionModal, setIstTransactionModal] = useState(false);
	const handleOpenModal = (downpayment, totalPrice) => {
		setDownpaymentPrice(downpayment);
		setTotalPrice(totalPrice);
		setIstTransactionModal(true);
	};
	const handleCloseModal = () => {
		setDownpaymentPrice("");
		setTotalPrice("");
		setIstTransactionModal(false);
	};
	const handleSubmit = (data) => {
		setDownpaymentPrice("");
		setTotalPrice("");
		handleSendMessage(data);
	};

	const [newMessage, setNewMessage] = useState("");
	const [replyMessage, setReplyMessage] = useState("");
	const [replyUser, setReplyUser] = useState("");
	const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

	const [downpaymentPrice, setDownpaymentPrice] = useState("");
	const [totalPrice, setTotalPrice] = useState("");

	// USE FOR PROGRESS
	const [isAddProgressStepModalOpen, setAddProgressStepModalOpen] =
		useState(false);
	const openAddProgressStepModal = () => setAddProgressStepModalOpen(true);
	const closeAddProgressStepModal = () => setAddProgressStepModalOpen(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleSave = async (appointmentData) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/setAppointment",
				{
					id: request?.id,
					appointmentNotes: appointmentData.appointmentNotes,
				}
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

	const submitOffer = () => {
		const offerString = `::downpayment::"${downpaymentPrice}",::totalprice::"${totalPrice}"`;
		handleSendMessage(offerString);
		setIsOfferModalOpen(false);
		setDownpaymentPrice("");
		setTotalPrice("");
	};

	interface Message {
		sender: string;
		text: string;
		replyText: string;
		replyTo: string;
	}
	interface Chat {
		id: string;
		userId: string;
		messages: Message[];
	}
	const [allMessages, setAllMessages] = useState<Chat | null>(null);
	const getAllMessage = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"chats/user",
				{ id: partnerId != "" ? partnerId : user.id }
			);
			if (data.success) {
				setReplyMessage("");
				setReplyUser("");
				setAllMessages(data.chats);
			} else {
				toast.error(
					data.message ||
						"Reloading chats failed, please check your credentials."
				);
			}
		} catch (error) {
			toast.error(`An error occurred. ${error}`);
		}
	};

	const updateMessage = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"chats/send-chat",
				{ oldChat: allMessages }
			);
			if (!data.success) {
				toast.error(
					data.message ||
						"Reloading chats failed, please check your credentials."
				);
			}
		} catch (error) {
			toast.error(`An error occurred while logging in. ${error}`);
		}
	};

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const scrollDown = (behavior) => {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ behavior: behavior });
	};

	useEffect(() => {
		getAllMessage();
		scrollDown("instant");
	}, [chatPartner, partnerId]);

	useEffect(() => {
		if (allMessages) {
			updateMessage();
			scrollDown("smooth");
		}
	}, [allMessages]);

	const handleSendMessage = async (message = "") => {
		let targetMessage = newMessage;
		if (message !== "") targetMessage = message;

		if (targetMessage.trim()) {
			const newMess = {
				sender: user.id,
				replyText: replyMessage,
				replyTo: replyUser,
				text: targetMessage,
				transactionAccepted: false,
			};
			if (allMessages) {
				const updatedMessages = {
					...allMessages.messages,
					[staffTarget]: allMessages.messages[staffTarget]
						? [...allMessages.messages[staffTarget], newMess]
						: [newMess],
				};

				const newChat = {
					...allMessages,
					messages: updatedMessages,
				};
				setAllMessages(newChat);
			}

			setNewMessage("");
			setReplyMessage("");
			setReplyUser("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	const handleReply = (index) => {
		if (allMessages) {
			setReplyMessage(allMessages.messages[staffTarget][index].text);
			setReplyUser(allMessages.messages[staffTarget][index].sender);
		}
	};

	const completeRequest = async () => {
		// alert(JSON.stringify(request));
		setIsModalOpen(true);
		// try {
		// 	const data = await RequestHandler.handleRequest(
		// 		"post",
		// 		"request/createAppointment",
		// 		{ id: request?.id, userId: request?.userId }
		// 	);
		// 	if (!data.success) {
		// 		toast.error(data.message || "Can't complete the request");
		// 	} else {
		// 		toast.success("Service completed successfully!");
		// 	}
		// } catch (error) {
		// 	toast.error(`An error occurred while logging in. ${error}`);
		// }
	};
	const handleDelete = (index) => {};

	return (
		<>
			<div className="chat-window">
				<div className="chat-header">
					<div>
						{chatPartner == "" ? "ADMIN" : chatPartner}
						{request
							? " (" + request.Service.serviceName + ")"
							: ""}
					</div>
				</div>
				<div className="message-container">
					{allMessages &&
						allMessages.messages[staffTarget] &&
						allMessages.messages[staffTarget].length > 0 &&
						allMessages.messages[staffTarget]?.map(
							(message, index) => (
								<Message
									key={index}
									user={request?.userId}
									assignedEmployee={
										staffId == "" ? user.id : staffId
									}
									request={request}
									text={message.text}
									isSent={message.sender == user.id}
									replyText={message.replyText}
									replyTo={
										message.replyTo == user.id
											? message.sender == user.id
												? "yourself"
												: "himself"
											: chatPartner
									}
									onReply={() => handleReply(index)}
									onDelete={() => handleDelete(index)}
									chatPartner={chatPartner}
									handleOpenModal={handleOpenModal}
									updateMessage={updateMessage}
								/>
							)
						)}
					<div ref={messagesEndRef} />
				</div>
				{request && request.price != null && (
					<div
						className={
							user.isEmployee ? "service-info" : "service-info-client"
						}
					>
						<div>
							<b>PAID AMOUNT:</b> ₱ {request.paidAmount}
						</div>
						<div>
							<b>TOTAL PRICE:</b> ₱ {request.price}
						</div>
						<div>
							<b>STATUS:</b> {request.status}
						</div>
					</div>
				)}
				{replyMessage && replyMessage !== "" ? (
					<div className="reply-input">
						<b>
							Replying to{" "}
							{replyUser == user.id ? "yourself" : chatPartner}
						</b>
						: {replyMessage}
					</div>
				) : null}
				<div className="message-input">
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message..."
						onKeyDown={handleKeyDown}
					/>

					{user.isEmployee &&
						request &&
						request.status != "COMPLETED" &&
						request.status != "APPOINTED" &&
						staffTarget !== "staffadmin" && (
							<button
								className="offer"
								onClick={openAddProgressStepModal}
							>
								Update Progress
							</button>
						)}
					{user.isEmployee &&
						request &&
						request.status != "COMPLETED" &&
						request.status != "APPOINTED" &&
						staffTarget !== "staffadmin" && (
							<button className="offer" onClick={completeRequest}>
								Set Appointment
							</button>
						)}

					<button onClick={() => handleSendMessage()}>Send</button>
				</div>

				{request && isOfferModalOpen && (
					<div className="chat-offer-modal-overlay">
						<div className="modal">
							<h3>{request.Service.serviceName} OFFER</h3>
							<label>
								Downpayment:
								<input
									type="number"
									value={downpaymentPrice}
									onChange={(e) =>
										setDownpaymentPrice(e.target.value)
									}
									placeholder="Enter downpayment price"
								/>
							</label>
							<label>
								Total Price:
								<input
									type="number"
									value={totalPrice}
									onChange={(e) =>
										setTotalPrice(e.target.value)
									}
									placeholder="Enter total price"
								/>
							</label>

							<div className="modal-buttons">
								<button
									className="submit-button"
									onClick={submitOffer}
								>
									Submit Offer
								</button>
								<button
									className="cancel-button"
									onClick={() => setIsOfferModalOpen(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<AppointmentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
			/>
			{transactionModal && (
				<TransactionModal
					downpaymentPrice={downpaymentPrice}
					totalPrice={totalPrice}
					request={request}
					onClose={handleCloseModal}
					onSubmit={handleSubmit}
				/>
			)}
			{isAddProgressStepModalOpen && request && (
				<AddProgressStepModal
					requestId={request.id}
					isOpen={isAddProgressStepModalOpen}
					onClose={closeAddProgressStepModal}
				/>
			)}
		</>
	);
}
