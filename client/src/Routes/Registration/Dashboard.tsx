import React, { useEffect } from "react";
import "./Dashboard.scss";
import Copyright from "../../Component/Copyright.tsx";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
	useEffect(() => {
		localStorage.clear();
		const message = sessionStorage.getItem("error-message");
		if (message) toast.error(message);
	}, []);

	return (
		<div className="dashboard">
			<div className="top"></div>
			<div className="middle">
				{/* <img src="https://scontent.fmnl16-1.fna.fbcdn.net/v/t39.30808-6/462369980_3280965058701224_1905723097683820295_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFANKPK2Eg0eGGEB3hZx28TjbA_NjG5ktONsD82MbmS03si0pBkLjYrNeC4nRtj43xuPe9p6-LIrHNoltLDs2Wz&_nc_ohc=CQagZh9kLZQQ7kNvgFgjbWS&_nc_zt=23&_nc_ht=scontent.fmnl16-1.fna&_nc_gid=AKkACk8Eel8YPAcEVImH7cx&oh=00_AYAlqjDDrI3Sixo3Z3gK6HH9fPShHCXt01MIyXmsMASMpg&oe=671B731A"></img> */}
				<img src=""></img>
				<NavLink to="login" className={"get-started"}>
					<div>GET STARTED</div>
				</NavLink>
				<div className="grid">
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
					<div className="service">BOOKKEEPING</div>
				</div>
			</div>
			<Copyright />
			<ToastContainer />
		</div>
	);
}
