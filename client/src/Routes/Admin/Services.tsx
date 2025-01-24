import React, { ReactElement, useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";

import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Details from "../../Component/Details.tsx";
import AdminFormMaker from "../../Component/AdminFormMaker.tsx";
import EditDetails from "../../Component/EditDetails.tsx";

export default function Services({ changeURL }) {
	interface Service {
		servicePrice: any;
		id: number;
		serviceName: string;
		serviceURL: string;
		serviceURLS: [string];
		serviceImg: string;
		serviceDescription: string;
	}

	const [formname, setFormName] = useState<string>();
	const [showForm, setShowForm] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [showEditDetails, setShowEditDetails] = useState(false);
	const [formPrice, setFormPrice] = useState(100);
	const [targetForm, setTargetForm] = useState<ReactElement | null>(null);
	const [formlink, setFormLink] = useState<string>("");
	const [formlinks, setFormLinks] = useState<string[]>([]);
	const [formid, setFormId] = useState<string>("");
	const [formimg, setFormImg] = useState("");
	const [description, setDescription] = useState("");

	const [services, setServices] = useState<Service[]>();
	const removeForm = () => {
		setShowForm(false);
		setTargetForm(null);
	};

	const getAllService = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"service/get_services"
			);

			if (data.success) {
				setServices(data.services);
			} else {
				toast.error(
					data.message ||
						"Reloading services failed, please check your credentials."
				);
			}
		} catch (error) {
			toast.error(`An error occurred. ${error}`);
		}
	};

	useEffect(() => {
		getAllService();
	}, []);

	const handleShowForm = (target, id, links, link, price) => {
		setFormName(target);
		setTargetForm(null);
		setFormLink(link);
		setFormLinks(links);
		setFormId(id);
		setFormPrice(price);
		setShowForm(true);
	};

	const handleShowDetailed = (target, id, image, desc) => {
		setFormId(id);
		setFormName(target);
		setFormImg(image);
		setDescription(desc);
		setShowDetails(true);
	};

	const handleShowEditDetailed = (target, id, image, desc, price) => {
		setFormId(id);
		setFormName(target);
		setFormImg(image);
		setDescription(desc);
		setFormPrice(price);
		setShowEditDetails(true);
	};

	const saveResource = async (
		formLinkss,
		serviceId,
	) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/update-document",
				{
					serviceId,
					formLinks: formLinkss,
				}
			);
			if (data.success) {
				toast.success("Service update save successfully.");
				getAllService();
			} else {
				toast.error("Service update save failed.");
			}
		} catch (error) {
			toast.error("Error the document");
		}
	};

	const deleteResource = async (formLinkss, setformLinkss, serviceId, index) => {
		if (formLinkss.length <= 1) {
			toast.error(
				"You must have at least one resource. Deletion is not allowed."
			);
			return;
		}
		const updatedLinks = formLinkss.filter((_, i) => i !== index);
		setformLinkss(updatedLinks);

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/update-document",
				{
					serviceId,
					formLinks: updatedLinks,
				}
			);
			if (data.success) {
				toast.success("Update service success.");
				getAllService();
			} else {
				toast.error("Service update failed.");
			}
		} catch (error) {
			toast.error("Error the document");
		}
	};

	const updateServiceDetail = async (
		serviceId,
		detail,
		price,
	) => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"request/update-document",
				{
					serviceId,
					detail,
					price,
				}
			);

			if (data.success) {
				toast.success("Update service success.");
				getAllService();
			} else {
				toast.error("Service update failed.");
			}
		} catch (error) {
			toast.error("Error the document");
		}
	};

	return (
		<>
			{showForm && (
				<AdminFormMaker
					removeForm={removeForm}
					formComp={targetForm}
					formName={formname}
					formLink={formlink}
					formLinks={formlinks}
					serviceId={formid}
					price={formPrice}
					deleteResource={deleteResource}
					saveResource={saveResource}
				/>
			)}
			{showDetails && (
				<Details
					setShowDetails={setShowDetails}
					formDetails={description}
					formName={formname}
					detailImg={formimg}
				/>
			)}
			{showEditDetails && (
				<EditDetails
					setShowDetails={setShowEditDetails}
					formDetails={description}
					formName={formname}
					detailImg={formimg}
					initialPrice={formPrice}
					serviceId={formid}
					onSave={updateServiceDetail}
				/>
			)}
			<div className="services bg-gray-50 min-h-screen">
				<TopBar clickHandler={() => changeURL("profile")} />
				<div className="main-services container mx-auto px-4">
					<div className="all-services grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{services &&
							services.map((service, index) => (
								<div
									key={index}
									className="service-card bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
								>
									<img
										src={service.serviceImg}
										alt={service.serviceName}
										className="service-img w-full h-40 object-cover rounded-md mb-4"
									/>
									<h3 className="service-title text-xl font-semibold text-green-700 mb-2">
										{service.serviceName}
									</h3>
									<p className="service-description text-sm text-gray-600 mb-4">
										{service.serviceDescription}
									</p>
									<div className="service-actions flex justify-between w-full">
										<button
											value={service.serviceName}
											className="take bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-100"
											onClick={(e) => {
												const target =
													e.currentTarget as HTMLButtonElement;
												handleShowForm(
													target.value,
													service.id,
													service.serviceURLS,
													service.serviceURL,
													service.servicePrice
												);
											}}
										>
											View Service
										</button>
										<button
											className="info bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md w-100"
											onClick={(e) => {
												const target =
													e.currentTarget as HTMLButtonElement;
												handleShowDetailed(
													target.value,
													service.id,
													service.serviceImg,
													service.serviceDescription
												);
											}}
										>
											Details
										</button>
										<button
											className="info bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md w-100"
											onClick={(e) => {
												const target =
													e.currentTarget as HTMLButtonElement;
												handleShowEditDetailed(
													target.value,
													service.id,
													service.serviceImg,
													service.serviceDescription,
													service.servicePrice
												);
											}}
										>
											Edit
										</button>
									</div>
								</div>
							))}
					</div>
				</div>
				<Copyright />
			</div>
		</>
	);
}
