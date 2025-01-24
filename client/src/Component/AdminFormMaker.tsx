import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import JSZip from "jszip";
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

export default function AdminFormMaker({
	removeForm,
	formComp,
	formName,
	serviceId = "1",
	formLink = "",
	formLinks = [""],
	price = 100,
	deleteResource,
	saveResource,
}) {
	const [formLinkss, setformLinkss] = useState(formLinks);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [previewIndex, setPreviewIndex] = useState(null);

	const togglePreview = (index) => {
		setPreviewIndex(previewIndex === index ? null : index);
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const addNewResource = () => {
		setformLinkss([...formLinkss, ""]);
	};

	const handleEditResource = (index, newValue) => {
		const updatedLinks = [...formLinkss];
		updatedLinks[index] = newValue;
		setformLinkss(updatedLinks);
	};

	return (
		<div className="form-maker">
			<div className="form-card bg-green-50 shadow-lg	rounded-lg p-8 w-full max-w-2xl">
				<div className="design h-2 bg-green-500	rounded-t-lg"></div>
				<h2 className="form-title text-2xl font-bold text-green-700	mb-4">
					{formName} DOCUMENT
				</h2>
				{/* <p className="text-lg font-semibold text-gray-600 p-3 rounded-lg shadow-sm border border-green-300 mb-3">
					PRICE PER DOCUMENT:{" "}
					<span className="text-green-700">₱{price}</span>
				</p> */}

				<button
					onClick={openModal}
					className="show-form-btn bg-green-600 hover:bg-green-700 text-white	px-4 py-2 rounded-md mb-4 ms-3"
				>
					SHOW {formName} FORM
				</button>
				<button
					type="button"
					onClick={removeForm}
					className="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md ms-3"
				>
					BACK
				</button>

				{/*	Modal for Form Preview */}
				{isModalOpen && (
					<div className="modal-form fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
						<div className="modal-content bg-white rounded-lg shadow-2xl overflow-hidden min-w-[50vw] w-full p-8">
							<div className="modal-header flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800">
									Available Resources
								</h2>
								<div className="header-actions flex items-center space-x-4">
									<button
										className="add-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow-md"
										onClick={addNewResource}
									>
										ADD
									</button>
									<button
										className="save-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold shadow-md ml-4"
										onClick={() =>
											saveResource(formLinkss, serviceId)
										}
									>
										SAVE
									</button>
									<span
										className="close text-3xl text-gray-500 cursor-pointer hover:text-gray-700"
										onClick={closeModal}
									>
										&times;
									</span>
								</div>
							</div>
							<div className="modal-body overflow-y-auto max-h-[80vh]">
								<ul className="space-y-6">
									{formLinkss.map((form, index) => (
										<li
											key={index}
											className="resource-item flex flex-col space-y-4 border-b border-gray-200 pb-6"
										>
											<div className="flex justify-between items-center">
												<input
													type="text"
													value={form}
													onChange={(e) =>
														handleEditResource(
															index,
															e.target.value
														)
													}
													className="text-lg font-medium text-gray-700 flex-grow border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
												<a
													target="_blank"
													rel="noopener noreferrer"
													href={form}
													download
													className="download-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow-md ml-4"
												>
													DOWNLOAD
												</a>
												<button
													className="delete-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold shadow-md ml-4"
													onClick={() =>
														deleteResource(
															formLinkss,
															setformLinkss,
															serviceId,
															index
														)
													}
												>
													DELETE
												</button>
												<button
													className="preview-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold shadow-md ml-4"
													onClick={() =>
														togglePreview(index)
													}
												>
													{previewIndex === index
														? "HIDE PREVIEW"
														: "PREVIEW"}
												</button>
											</div>
											{previewIndex === index && (
												<>
													{form.endsWith(".png") ||
													form.endsWith(".jpg") ? (
														<img
															src={form}
															alt={`${formName} preview`}
															className="w-full max-h-96 object-contain rounded border"
														/>
													) : form.endsWith(
															".pdf"
													  ) ? (
														<iframe
															src={form}
															title={`${formName} preview`}
															className="w-full max-h-96 border rounded"
														/>
													) : (
														<span className="text-sm text-gray-500 italic">
															Preview not
															available for this
															file type.
														</span>
													)}
												</>
											)}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
			<ToastContainer />
		</div>
	);
}
