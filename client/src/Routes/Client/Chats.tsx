import React, { useEffect, useState } from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import ChatWindow from "../../Component/Chats.tsx";
import "./SCSS/Chats.scss";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import RequestHandler from "../../Functions/RequestHandler.js";

function TopNav({ setChatSetup, topActive, setTopActive }) {
	return (
		<div className="top-nav">
			<button
				className={`nav-btn ${topActive == "admin" ? "active" : ""}`}
				onClick={() => {
					setChatSetup(null);
					setTopActive("admin");
				}}
			>
				Admin
			</button>
			<button
				className={`nav-btn ${topActive != "admin" ? "active" : ""}`}
			>
				Staff
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

function ChatList({ setChatSetup, setTopActive }) {
	const navigate = useNavigate();
	interface Message {
		text: string;
	}
	interface Chat {
		ids: string;
		profilePic: string;
		username: string;
		messages: Message[];
	}
	const [chats, setChats] = useState<Chat[]>();

	useEffect(() => {
		if (localStorage.getItem("users") === null) {
			sessionStorage.setItem("error-message", "Invalid User Token");
			navigate("/");
		}
		sessionStorage.removeItem("error-message");
	}, []);
	const user = JSON.parse(localStorage.getItem("users") || "{}");
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"chats/get-chat-user",
					{ id: user.id }
				);
				if (data.success) {
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
	}, []);

	return (
		<div className="chat-list">
			{chats &&
				chats.map((chat) => (
					<div key={chat.ids} className="chat-item">
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
							onClick={() => {
								setChatSetup({
									chatPartner: chat.username,
									partnerId: user.id,
									staffId: chat.ids,
								});
								setTopActive("staff");
							}}
						>
							<div className="chat-name">{chat.username}</div>
							<div className="chat-last-message">
								{chat.messages && chat.messages.length > 0
									? chat.messages[
											chat.messages.length - 1
									  ].text.slice(0, 25) + "..."
									: "No messages yet..."}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}

function ChatContainer({ setChatSetup }) {
	const [topActive, setTopActive] = useState("admin");
	return (
		<div className="chat-container">
			<TopNav
				setChatSetup={setChatSetup}
				topActive={topActive}
				setTopActive={setTopActive}
			/>
			<SearchBar />
			<ChatList setChatSetup={setChatSetup} setTopActive={setTopActive} />
		</div>
	);
}

export default function Chats({ changeURL }) {
	interface ChatSetup {
		chatPartner: string;
		partnerId: string;
		staffId: string;
	}
	const [request, setRequest] = useState(null);
	const [chatSetup, setChatSetup] = useState<ChatSetup | null>(null);

	useEffect(() => {
		const fetchRequest = async () => {
			try {
				const data = await RequestHandler.handleRequest(
					"post",
					"request/view_user_service",
					{ staffId: chatSetup?.staffId }
				);
				if (data.success) {
					setRequest(data.data);
				} else {
					toast.error(
						data.message ||
							"Loading request failed, please check your credentials."
					);
				}
			} catch (error) {
				toast.error(`An error occurred. ${error}`);
			}
		};

		if (chatSetup) {
			fetchRequest();
		}
	}, [chatSetup]);
	return (
		<div className="staff-chats">
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-chats">
				<ChatContainer setChatSetup={setChatSetup} />
				{chatSetup ? (
					<ChatWindow
						request={request}
						chatPartner={chatSetup.chatPartner}
						partnerId={chatSetup.partnerId}
						staffId={chatSetup.staffId}
					/>
				) : (
					<ChatWindow chatPartner="" staffId="admin" />
				)}
			</div>
			<Copyright />
		</div>
	);
}
