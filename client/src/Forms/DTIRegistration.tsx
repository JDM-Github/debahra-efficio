import React, { useState } from "react";
import {
	FormInput,
	FormSelect,
	FormTextArea,
} from "../Component/FormMaker.tsx";

export default function DTIRegistration() {
	const [formData, setFormData] = useState({
		name: "",
		businessName: "",
		businessType: "",
		dateOfRegistration: "",
		description: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<>
			<FormInput
				label={"Name"}
				type="text"
				id="name"
				name="name"
				placeholder="Enter your name"
				value={formData.name}
				onChange={handleInputChange}
				required={true}
			/>

			<FormInput
				label={"Business Name"}
				type="text"
				id="businessName"
				name="businessName"
				placeholder="Enter your business name"
				value={formData.businessName}
				onChange={handleInputChange}
				required={true}
			/>

			<FormSelect
				label={"Business Type"}
				id="businessType"
				name="businessType"
				value={formData.businessType}
				onChange={handleInputChange}
				required={true}
			>
				<option value="">Select a business type</option>
				<option value="sole_proprietorship">Sole Proprietorship</option>
				<option value="partnership">Partnership</option>
				<option value="corporation">Corporation</option>
				<option value="cooperative">Cooperative</option>
			</FormSelect>

			<FormInput
				label={"Date of Registration"}
				type="date"
				id="dateOfRegistration"
				name="dateOfRegistration"
				value={formData.dateOfRegistration}
				onChange={handleInputChange}
				required={true}
			/>

			<FormTextArea
				label={"Description"}
				id="description"
				name="description"
				placeholder="Enter business details"
				value={formData.description}
				onChange={handleInputChange}
				required={true}
			/>
		</>
	);
}
