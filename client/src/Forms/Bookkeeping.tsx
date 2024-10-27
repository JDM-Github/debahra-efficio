import React, { useState } from "react";
import {
	FormInput,
	FormSelect,
	FormTextArea,
} from "../Component/FormMaker.tsx";

export default function BookKeeping() {
	const [formData, setFormData] = useState({
		date: "",
		description: "",
		amount: "",
		category: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<>
			<FormInput
				label={"Date"}
				type="date"
				id="date"
				name="date"
				value={formData.date}
				onChange={handleInputChange}
				required={true}
			/>

			<FormTextArea
				label={"Description"}
				id="description"
				name="description"
				placeholder="Enter transaction details"
				value={formData.description}
				onChange={handleInputChange}
				required={true}
			/>

			<FormInput
				label={"Amount"}
				type="number"
				id="amount"
				name="amount"
				placeholder="Enter amount"
				value={formData.amount}
				onChange={handleInputChange}
				required={true}
			/>

			<FormSelect
				label={"Category"}
				id="category"
				name="category"
				value={formData.category}
				onChange={handleInputChange}
				required={true}
			>
				<option value="">Select a category</option>
				<option value="income">Income</option>
				<option value="expense">Expense</option>
				<option value="investment">Investment</option>
			</FormSelect>
		</>
	);
}
