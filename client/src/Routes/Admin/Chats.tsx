import React, {useState} from 'react';
import './Chats.scss';

import RequestHandler from '../../Functions/RequestHandler.js';

function Message({ text, isSent }) {
	return (
		<div className={`message ${isSent ? 'sent' : 'received'}`}>
			{text}
		</div>
	);
}

function ChatWindow({ chatPartner }) {
	const [messages, setMessages] = useState([
		{ text: "Hello, what do you think about the request?", isSent: false },
		{ text: "I will look into it.", isSent: true },
		{ text: "Oh okay, update me.", isSent: false }
	]);
	const [newMessage, setNewMessage] = useState('');

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([...messages, { text: newMessage, isSent: true }]);
			setNewMessage('');

			RequestHandler.handleRequest("post", "test")
			.then((response) => { alert(response); });
		}
	};

	return (
		<div className="chat-window">
			<div className="chat-header">
				<div>{chatPartner}</div>
			</div>
			<div className="message-container">
				{messages.map((message, index) => (
					<Message key={index} text={message.text} isSent={message.isSent} />
				))}
			</div>
			<div className="message-input">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
				/>
				<button onClick={handleSendMessage}>Send</button>
			</div>
		</div>
	);
}






function TopNav() {
	return (
		<div className="top-nav">
			<button className="nav-btn active">People</button>
			<button className="nav-btn">Groups</button>
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

function ChatList() {
	return (
		<div className="chat-list">
			<div className="chat-item">
				<img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic" />
				<div className="chat-info">
					<div className="chat-name">P1</div>
					<div className="chat-last-message">I will think about it...</div>
				</div>
			</div>
			<div className="chat-item">
				<img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic" />
				<div className="chat-info">
					<div className="chat-name">P2</div>
					<div className="chat-last-message">Sure.</div>
				</div>
			</div>
			<div className="chat-item">
				<img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic" />
				<div className="chat-info">
					<div className="chat-name">P3</div>
					<div className="chat-last-message">ok</div>
				</div>
			</div>
		</div>
	);
}


function ChatContainer() {
	return (
		<div className="chat-container">
			<TopNav />
			<SearchBar />
			<ChatList />
		</div>
	);
}








function PeopleWhoAddedYouItem({ profilePic, name, onAccept, onRemove }) {
	return (
		<div className="people-who-added-you-item">
			<img className="profile-pic" src={profilePic} alt={`${name}'s profile`} />
			<div className="people-details">
				<div className="name">{name}</div>
				<div className="actions">
					<button className="accept-btn" onClick={onAccept}>Accept</button>
					<button className="remove-btn" onClick={onRemove}>Remove</button>
				</div>
			</div>
		</div>
	);
}

function SuggestionItem({ profilePic, name, onAddFriend }) {
	return (
		<div className="suggestion-item">
			<img className="profile-pic" src={profilePic} alt={`${name}'s profile`} />
			<div className="suggestion-details">
				<div className="name">{name}</div>
				<button className="add-friend-btn" onClick={onAddFriend}>
					Add Friend
				</button>
			</div>
		</div>
	);
}

function SuggestionList({className})
{
	const peopleWhoAddedYou = [
		{ name: 'Dave', profilePic: 'https://via.placeholder.com/50' },
		{ name: 'Eve', profilePic: 'https://via.placeholder.com/50' },
	];

	const suggestions = [
		{ name: 'Alice', profilePic: 'https://via.placeholder.com/50' },
		{ name: 'Bob', profilePic: 'https://via.placeholder.com/50' },
		{ name: 'Charlie', profilePic: 'https://via.placeholder.com/50' },
	];

	const handleAcceptFriend = (name) => alert(`${name} has been accepted as a friend.`);
	const handleRemoveFriend = (name) => alert(`${name} has been removed.`);
	const handleAddFriend    = (name) => alert(`Friend request sent to ${name}`);

	return (
		<div className={`suggestion-container ${className}`}>
			<div className="title-suggest">People Who Added You</div>
			<div className="people-who-added-you-list">
				{peopleWhoAddedYou.map((person, index) => (
					<PeopleWhoAddedYouItem
						key={index}
						profilePic={person.profilePic}
						name={person.name}
						onAccept={() => handleAcceptFriend(person.name)}
						onRemove={() => handleRemoveFriend(person.name)}
					/>
				))}
			</div>

			<hr className="divider" />

			<div className="title-suggest">Suggestions</div>
			<div className="suggestion-list">
				{suggestions.map((suggestion, index) => (
					<SuggestionItem
						key={index}
						profilePic={suggestion.profilePic}
						name={suggestion.name}
						onAddFriend={() => handleAddFriend(suggestion.name)}
					/>
				))}
			</div>
		</div>
	);
}

export default function Chats({isShrunk}) {
	return (
		<div className="chats">
			<div className="title">ADMIN CHATS</div>
			<div className="main-chats">
				<ChatContainer />
				<ChatWindow chatPartner="JD"/>
				<SuggestionList className={!isShrunk ? 'expanded' : ''} />
			</div>
		</div>
	);
}
