import React, { useState } from "react";
import "./SCSS/TransactionModal.scss";
import RequestHandler from "../Functions/RequestHandler";
import { toast } from "react-toastify";

export default function TransactionModal({
	downpaymentPrice,
	totalPrice,
	request,
	onClose,
	onSubmit,
}) {
	const [referenceNumber, setReferenceNumber] = useState("");
	const [proofImage, setProofImage] = useState(null);
	const [typeTransaction, setTypeTransaction] = useState("");
	const [amount, setAmount] = useState("");

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProofImage(file);
		}
	};

	const handleSubmit = async () => {
		if (
			referenceNumber === "" ||
			proofImage === null ||
			typeTransaction === "" ||
			amount === ""
		) {
			toast.error("Input must not be empty.");
			return;
		}
		if (typeTransaction === "downpayment" && downpaymentPrice > amount) {
			toast.error("Downpayment is unsufficient.");
			return;
		}

		let uploadedDocument = "";
		if (proofImage) {
			const formData = new FormData();
			formData.append("file", proofImage);

			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"request/upload-image",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				if (data.success) {
					uploadedDocument = data.uploadedDocument;
				} else {
					toast.error(data.message);
					return;
				}
			} catch (error) {
				console.error("Error submitting the document:", error);
				toast.error("Error submitting the document");
				return;
			}
		}

		const formattedData = `::referencenumber::"${referenceNumber}",::proof::"${uploadedDocument}",::amount::"${amount}",::type::"${typeTransaction}",::totalprice::"${
			totalPrice ? totalPrice : 0
		}",::downpayment::"${downpaymentPrice ? downpaymentPrice : 0}"`;

		onSubmit(formattedData);
		onClose();
	};

	return (
		<div className="transaction-modal">
			<div className="modal-content">
				<span className="close-button" onClick={onClose}>
					&times;
				</span>
				<h2>Transaction Details</h2>
				<div className="input-group">
					<label>Type Of Transaction:</label>
					<select
						value={typeTransaction}
						onChange={(e) => setTypeTransaction(e.target.value)}
						className="transaction-type-select"
					>
						<option value="" disabled>
							Select Transaction Type
						</option>
						{request && request.price == null ? (
							<option value="downpayment">Downpayment</option>
						) : (
							<>
								<option value="fullpayment">
									Full Payment
								</option>
								<option value="partialpayment">
									Partial Payment
								</option>
							</>
						)}
					</select>
				</div>
				<div className="input-group">
					<label>Reference Number:</label>
					<input
						type="text"
						value={referenceNumber}
						onChange={(e) => setReferenceNumber(e.target.value)}
						placeholder="Enter Reference Number"
					/>
				</div>

				<div className="input-group">
					<label>Proof of Payment:</label>
					<input
						type="file"
						accept="image/*"
						id="proof-upload"
						onChange={handleImageUpload}
					/>
					<label htmlFor="proof-upload" className="file-upload-label">
						Choose File
					</label>
					{proofImage && (
						<div className="image-preview">
							<img
								src={URL.createObjectURL(proofImage)}
								alt="Proof Preview"
							/>
						</div>
					)}
				</div>

				<div className="input-group">
					<label>Amount (₱):</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="Enter Amount"
					/>
				</div>

				<button className="submit-button" onClick={handleSubmit}>
					Submit
				</button>
			</div>
		</div>
	);
}
