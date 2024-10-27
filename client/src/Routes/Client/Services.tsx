import React, { ReactElement, useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import FormMaker from "../../Component/FormMaker.tsx";
import "./Services.scss";

import BookKeeping from "../../Forms/Bookkeeping.tsx";
import DTIRegistration from "../../Forms/DTIRegistration.tsx";
import RequestHandler from "../../Functions/RequestHandler.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Details from "../../Component/Details.tsx";

const AllTarget = {
	// "DTI REGISTRATION": <DTIRegistration />,
};

export default function Services({ changeURL }) {
	interface Service {
		id: number;
		serviceName: string;
		serviceURL: string;
		serviceImg: string;
		serviceDescription: string;
	}

	const [formname, setFormName] = useState<string>();
	const [showForm, setShowForm] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [targetForm, setTargetForm] = useState<ReactElement | null>(null);
	const [formlink, setFormLink] = useState<string>("");
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

	const handleShowForm = (target, id, link) => {
		setFormName(target);
		setTargetForm(AllTarget[target] || null);
		setFormLink(link);
		setFormId(id);
		setShowForm(true);
	};

	const handleShowDetailed = (target, image, desc) => {
		setFormName(target);
		setFormImg(image);
		setDescription(desc);
		setShowDetails(true);
	};

	return (
		<>
			{showForm && (
				<FormMaker
					removeForm={removeForm}
					formComp={targetForm}
					formName={formname}
					formLink={formlink}
					serviceId={formid}
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
			<div className={`services`}>
				<TopBar clickHandler={() => changeURL("profile")} />
				<div className="main-services">
					<div className="all-services">
						{services &&
							services.map((service, index) => (
								<div>
									<img src={service.serviceImg}></img>
									<button
										key={index}
										value={service.serviceName}
										className="take"
										onClick={(e) => {
											const target =
												e.currentTarget as HTMLButtonElement;
											handleShowForm(
												target.value,
												service.id,
												service.serviceURL
											);
										}}
									>
										Take this service!
									</button>
									<button
										className="info"
										onClick={(e) => {
											const target =
												e.currentTarget as HTMLButtonElement;
											handleShowDetailed(
												target.value,
												service.serviceImg,
												service.serviceDescription
											);
										}}
									>
										Details
									</button>
								</div>
							))}
					</div>
				</div>
				<Copyright />
				<ToastContainer />
			</div>
		</>
	);
}
