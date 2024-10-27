import React from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import ChatWindow from "../../Component/Chats.tsx";
import "./Chats.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Chats({ changeURL }) {
	return (
		<div className="client-chats">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-chats">
				<ChatWindow chatPartner="SERVICE" />
			</div>
			<Copyright />
			<ToastContainer />
		</div>
	);
}
