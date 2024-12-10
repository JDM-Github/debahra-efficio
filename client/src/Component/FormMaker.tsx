import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./FormMaker.scss";
import RequestHandler from "../Functions/RequestHandler";

export function FormInput({
	label,
	onChange,
	value = "",
	type = "text",
	name = "name",
	id = "name",
	placeholder = "",
	required = false,
}) {
	const today = new Date().toISOString().split("T")[0];
	return (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<input
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				min={type === "date" ? today : undefined}
			/>
		</div>
	);
}

export function FormTextArea({
	label,
	onChange,
	value = "",
	name = "name",
	id = "name",
	placeholder = "",
	required = false,
}) {
	return (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<textarea
				id={id}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
			/>
		</div>
	);
}

export function FormSelect({
	label,
	onChange,
	value = "",
	name = "name",
	id = "name",
	required = false,
	children,
}) {
	return (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<select
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
			>
				{children}
			</select>
		</div>
	);
}

export default function FormMaker({
	removeForm,
	formComp,
	formName,
	serviceId = "1",
	formLink = "",
	price = 100,
}) {
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fileType, setFileType] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const formValues: string[] = [];

		for (let [name, value] of formData.entries()) {
			formValues.push(`${name}: ${value}`);
		}
		removeForm();
	};

	const createPaymentSession = async (body) => {
		try {
			const response = await RequestHandler.handleRequest(
				"post",
				"create-payment",
				{
					amount: price,
					userId: user.id,
					body,
				}
			);
			if (response.redirectUrl) {
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

	const submitDocument = async () => {
		if (!uploadedFile) {
			toast.error("Please	select a file!");
			return;
		}

		const formData = new FormData();
		formData.append("file", uploadedFile);
		let imageUrl = "";
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"image/upload-image",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (data.success) {
				imageUrl = data.uploadedDocument;
			} else {
				toast.error(data.message);
				return null;
			}
		} catch (error) {
			console.error("Error submitting	the	document:", error);
			toast.error("Error submitting the document");
			return null;
		}

		await createPaymentSession({
			userId: user.id,
			imageUrl,
			serviceId,
			price: price,
			serviceName: formName,
		});
		return;
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setUploadedFile(file);
			setFileType(file.type);
		}
	};

	const openModal = () => {
		if (formLink === "") {
			toast.error("No	Image Provided.");
		} else setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="form-maker">
			{formComp && (
				<div className="form-card bg-green-50 shadow-lg	rounded-lg p-8 w-full max-w-2xl">
					<div className="design h-2 bg-green-500	rounded-t-lg"></div>
					<h2 className="form-title text-2xl font-bold text-green-700	mb-4">
						{formName} FORM
					</h2>
					<form
						onSubmit={handleSubmit}
						className="generated-form space-y-4"
					>
						{formComp}
						<div className="flex justify-between">
							<button
								type="submit"
								className="submit-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
							>
								TAKE THIS SERVICE
							</button>
							<button
								type="button"
								onClick={removeForm}
								className="cancel-btn bg-gray-300 hover:bg-gray-400	text-gray-700 px-4 py-2	rounded-md"
							>
								CANCEL
							</button>
						</div>
					</form>
				</div>
			)}

			{/*	Document Upload	and	Details	Card */}
			<div className="form-card bg-green-50 shadow-lg	rounded-lg p-8 w-full max-w-2xl">
				<div className="design h-2 bg-green-500	rounded-t-lg"></div>
				<h2 className="form-title text-2xl font-bold text-green-700	mb-4">
					{formName} DOCUMENT
				</h2>
				<p className="text-lg text-green-600 font-semibold mb-4">
					Service Price: ₱{price}
				</p>
				<button
					onClick={openModal}
					className="show-form-btn bg-green-600 hover:bg-green-700 text-white	px-4 py-2 rounded-md mb-4"
				>
					SHOW {formName} FORM
				</button>
				<div className="upload-form	mt-4 space-y-4">
					<label className="upload-label flex	flex-col items-center bg-green-100 border border-green-300 rounded-lg p-4 cursor-pointer">
						<input
							type="file"
							accept=".pdf,.jpg,.jpeg,.png"
							onChange={handleFileChange}
							className="hidden"
							required
						/>
						<span className="text-green-700	font-medium">
							Upload Document
						</span>
					</label>
					{uploadedFile && fileType.startsWith("image/") && (
						<img
							src={URL.createObjectURL(uploadedFile)}
							className="uploaded-img	max-h-64 object-contain	mx-auto"
							alt="Uploaded Preview"
						/>
					)}
					{uploadedFile && fileType === "application/pdf" && (
						<iframe
							src={URL.createObjectURL(uploadedFile)}
							className="uploaded-img	w-full h-64	border border-green-300"
							title="Uploaded	PDF	Preview"
						/>
					)}
					<div className="flex justify-between">
						<button
							type="submit"
							className="submit-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
							onClick={submitDocument}
						>
							SUBMIT DOCUMENT
						</button>
						<button
							type="button"
							onClick={removeForm}
							className="cancel-btn bg-gray-300 hover:bg-gray-400	text-gray-700 px-4 py-2	rounded-md"
						>
							CANCEL
						</button>
					</div>
				</div>

				{/*	Modal for Form Preview */}
				{isModalOpen && (
					<div className="modal-form fixed inset-0 bg-black bg-opacity-50	flex items-center justify-center z-50">
						<div className="modal-content bg-white rounded-lg shadow-lg	overflow-hidden	max-w-6xl w-full">
							<div className="relative">
								<span
									className="close absolute top-2	right-2	text-2xl text-gray-700 cursor-pointer"
									onClick={closeModal}
								>
									&times;
								</span>
								<img
									src={formLink}
									alt="DTI Registration Form"
									className="w-full max-h-[80vh] object-contain"
								/>
							</div>
							<a
								target="_blank"
								href={formLink}
								download
								className="download-btn	block bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2"
							>
								DOWNLOAD
							</a>
						</div>
					</div>
				)}
			</div>
			<ToastContainer />
		</div>
	);
}
