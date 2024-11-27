import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import ChatWindow from "../../Component/Chats.tsx";
import "./SCSS/Chats.scss";

import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";

function TopNav({ isEmployeeActive, setEmployeeActive }) {
	return (
		<div className="top-nav">
			<button
				className={`nav-btn ${isEmployeeActive ? "active" : ""}`}
				onClick={() => setEmployeeActive(true)}
			>
				Staff
			</button>
			<button
				className={`nav-btn ${!isEmployeeActive ? "active" : ""}`}
				onClick={() => setEmployeeActive(false)}
			>
				Customer
			</button>
		</div>
	);
}

function SearchBar() {
	return (
		<div className="search-bar">
			<input type="text" placeholder="Search..." />
		</div>
	);
}

function ChatList({ setChatSetup, isEmployeeActive }) {
	interface Message {
		text: string;
	}
	interface User {
		username: string;
	}
	interface Chat {
		id: string;
		userId: string;
		profilePic: string;
		messages: Message[];
		User: User;
	}
	const [chats, setChats] = useState<Chat[]>();

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"chats/get-chat",
					{ isEmployee: isEmployeeActive }
				);

				if (data.success) {
					// alert(JSON.stringify(data.chats));
					setChats(data.chats);
				} else {
					toast.error(
						data.message ||
							"Reloading chats failed, please check your credentials."
					);
				}
			} catch (error) {
				toast.error(`An error occurred. ${error}`);
			}
		};

		fetchChats();
	}, [isEmployeeActive]);

	return (
		<div className="chat-list">
			{chats &&
				chats.map((chat) => (
					<div key={chat.id} className="chat-item">
						<img
							src={
								chat.profilePic ||
								"https://via.placeholder.com/50"
							}
							alt="Profile"
							className="profile-pic"
						/>
						<div
							className="chat-info"
							onClick={() =>
								setChatSetup({
									chatPartner: chat.User.username,
									partnerId: chat.userId,
								})
							}
						>
							<div className="chat-name">
								{chat.User.username}
							</div>
							<div className="chat-last-message">
								{chat.messages["staffadmin"] &&
								chat.messages["staffadmin"].length > 0
									? chat.messages["staffadmin"][
											chat.messages["staffadmin"].length -
												1
									  ].text
									: "No messages yet..."}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}

function ChatContainer({ setChatSetup }) {
	const [isEmployeeActive, setEmployeeActive] = useState(false);
	return (
		<div className="chat-container">
			<TopNav
				isEmployeeActive={isEmployeeActive}
				setEmployeeActive={setEmployeeActive}
			/>
			<SearchBar />
			<ChatList
				setChatSetup={setChatSetup}
				isEmployeeActive={isEmployeeActive}
			/>
		</div>
	);
}

export default function Chats() {
	interface ChatSetup {
		chatPartner: string;
		partnerId: string;
	}
	const [chatSetup, setChatSetup] = useState<ChatSetup>();
	return (
		<div className="chats">
			<TopBar clickHandler={null} />
			<div className="main-chats">
				<ChatContainer setChatSetup={setChatSetup} />
				{chatSetup && (
					<ChatWindow
						chatPartner={chatSetup.chatPartner}
						partnerId={chatSetup.partnerId}
						staffId="admin"
					/>
				)}
			</div>
			<Copyright />
		</div>
	);
}
