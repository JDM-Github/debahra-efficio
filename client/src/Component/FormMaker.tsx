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

export default function FormMaker({
	removeForm,
	formComp,
	formName,
	serviceId = "1",
	formLink = "",
	formLinks = [""],
	price = 100,
}) {
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fileType, setFileType] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const navigate = useNavigate();
	const [previewIndex, setPreviewIndex] = useState(null);

	const togglePreview = (index) => {
		setPreviewIndex(previewIndex === index ? null : index);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const formValues: string[] = [];

		for (let [name, value] of formData.entries()) {
			formValues.push(`${name}: ${value}`);
		}
		removeForm();
	};

	const submitDocument = async () => {
		if (!uploadedFile) {
			toast.error("Please upload a valid ZIP file!");
			return;
		}
		if (!image) {
			toast.error("Please upload a certificate!");
			return;
		}

		const toastId = toast.loading("Uploading files, please wait...");
		const uploadedFileUrls: any[] = [];
		let newUploadedFile = "";

		try {
			const zip = await JSZip.loadAsync(uploadedFile);
			const files = Object.keys(zip.files);

			for (const fileName of files) {
				const file = zip.files[fileName];
				const splitted = fileName.split(".");
				const fileExtension = splitted.pop()?.toLowerCase();

				if (file.dir || fileExtension !== "pdf") {
					toast.warning(`Skipping non-PDF file: ${fileName}`);
					continue;
				}

				const fileContent = await file.async("blob");
				const formData = new FormData();
				formData.append("file", new File([fileContent], fileName));
				formData.append("fileType", fileExtension);

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
						uploadedFileUrls.push({
							fileName,
							url: data.uploadedDocument,
							isApproved: false,
						});
					} else {
						toast.update(toastId, {
							render: `Failed to upload ${fileName}: ${data.message}`,
							type: "error",
							isLoading: false,
							autoClose: 5000,
						});
						return null;
					}
				} catch (error) {
					console.error(`Error uploading ${fileName}:`, error);
					toast.update(toastId, {
						render: `Error uploading ${fileName}`,
						type: "error",
						isLoading: false,
						autoClose: 5000,
					});
					return null;
				}
			}

			if (uploadedFileUrls.length <= 0) {
				toast.update(toastId, {
					render: "No files uploaded!",
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
				return;
			}
			toast.update(toastId, {
				render: "All files uploaded successfully!",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
			console.log("Uploaded file URLs:", uploadedFileUrls);
		} catch (error) {
			console.error("Error processing the ZIP file:", error);
			toast.update(toastId, {
				render: "Error processing the ZIP file",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}

		const formData = new FormData();
		formData.append("file", image);
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
				newUploadedFile = data.uploadedDocument;
			} else {
				toast.update(toastId, {
					render: `Failed to upload ${image.name}: ${data.message}`,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
				return null;
			}
		} catch (error) {
			console.error(`Error uploading ${image.name}:`, error);
			toast.update(toastId, {
				render: `Error uploading ${image.name}`,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			return null;
		}

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/request-document",
				{
					userId: user.id,
					serviceId,
					serviceName: formName,
					image: newUploadedFile,
					imageUrls: uploadedFileUrls,
				}
			);
			if (data.success) {
				toast.success("Request success.");
				navigate("/client/ongoing-request", { replace: true });
			} else {
				toast.error("Request failed.");
				navigate("/client/services", { replace: true });
			}
		} catch (error) {
			toast.error("Error submitting the document");
			navigate("/client/services", { replace: true });
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setUploadedFile(file);
			setFileType(file.type);
		}
	};
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);
		}
	};

	const openModal = () => {
		setIsModalOpen(true);
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
				{/* <p className="text-lg text-green-600 font-semibold mb-4">
					Service Price: ₱{price}
				</p> */}
				{/* <p className="text-lg font-semibold text-gray-600 p-3 rounded-lg shadow-sm border border-green-300 mb-3">
					PRICE PER DOCUMENT:{" "}
					<span className="text-green-700">₱{price}</span>
				</p> */}
				<button
					onClick={openModal}
					className="show-form-btn bg-green-600 hover:bg-green-700 text-white	px-4 py-2 rounded-md mb-4"
				>
					SHOW {formName} FORM
				</button>
				<div className="upload-form mt-4 space-y-4">
					<label className="upload-label flex flex-col items-center bg-green-100 border border-green-300 rounded-lg p-4 cursor-pointer">
						<input
							type="file"
							accept=".zip"
							onChange={handleFileChange}
							className="hidden"
							required
						/>
						<span className="text-green-700 font-medium">
							Upload ZIP File
						</span>
					</label>

					{/* Show file name if a ZIP file is uploaded */}
					{uploadedFile &&
						(fileType === "application/zip" ||
							fileType === "application/x-zip-compressed") && (
							<div className="uploaded-file mt-4 text-center text-green-700">
								<p className="font-medium">
									Uploaded File: {uploadedFile.name}
								</p>
							</div>
						)}

					{uploadedFile &&
						fileType !== "application/zip" &&
						fileType !== "application/x-zip-compressed" && (
							<div className="unsupported-file mt-4 text-center text-red-600">
								<p className="font-medium">
									Unsupported file type! Please upload a ZIP
									file.
								</p>
							</div>
						)}

					<label className="upload-label flex flex-col items-center bg-green-100 border border-green-300 rounded-lg p-4 cursor-pointer">
						<input
							type="file"
							accept=".pdf"
							onChange={handleImageChange}
							className="hidden"
							required
						/>
						<span className="text-green-700 font-medium">
							Upload Certificate
						</span>
					</label>

					{image && (
						<div className="uploaded-file mt-4 text-center text-green-700">
							<p className="font-medium">
								Uploaded Certificate: {image.name}
							</p>
						</div>
					)}

					<div className="flex justify-between">
						<button
							type="submit"
							className="submit-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
							onClick={submitDocument}
							disabled={
								!uploadedFile ||
								(fileType !== "application/zip" &&
									fileType !== "application/x-zip-compressed")
							}
						>
							SUBMIT ZIP FILE
						</button>
						<button
							type="button"
							onClick={removeForm}
							className="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
						>
							CANCEL
						</button>
					</div>
				</div>

				{isModalOpen && (
					<div className="modal-form fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
						<div className="modal-content bg-white rounded-lg shadow-2xl overflow-hidden min-w-[50vw] w-full p-8">
							<div className="modal-header flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800">
									Available Resources
								</h2>
								<div className="header-actions flex items-center space-x-4">
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
									{formLinks.map((form, index) => (
										<li
											key={index}
											className="resource-item flex flex-col space-y-4 border-b border-gray-200 pb-6"
										>
											<div className="flex justify-between items-center">
												<span className="text-lg font-medium">
													{formName} Resource
												</span>
												<div>
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
