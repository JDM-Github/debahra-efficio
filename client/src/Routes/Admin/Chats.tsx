import React, {useState} from 'react';
import TopBar     from './TopBar.tsx';
import Copyright  from './Copyright.tsx';
import './Chats.scss';

import RequestHandler from '../../Functions/RequestHandler.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Message({ text, isSent, replyText, replyTo, reactMessage, onReply, onReact, onDelete }) {

	return (
		<>
		{
			replyText && replyText !== '' ? 
			<>
				<div className={`reply-to ${isSent ? 'sent' : 'received'}`}>You replied to {replyTo}</div>
				<div className={`reply-message ${isSent ? 'sent' : 'received'}`}>{replyText}</div>
			</> : null
		}
		<div
			className={`message ${isSent ? 'sent' : 'received'}`}
		>
			{text}
			<div className="message-buttons">
				<button onClick={onReply}>
					<FontAwesomeIcon icon={faReply} />
				</button>
				<button onClick={onReact}>
					<FontAwesomeIcon icon={faHeart} />
				</button>
				<button onClick={onDelete}>
					<FontAwesomeIcon icon={faTrashAlt} />
				</button>
			</div>
		</div>
		</>
	);
}

function ChatWindow({ chatPartner }) {
	const [messages, setMessages] = useState([
		{ replyTo: '', replyText: '', text: "Hello, what do you think about the request?", isSent: false },
		{ replyTo: '', replyText: '', text: "I will look into it.", isSent: true },
		{ replyTo: 'JD', replyText: 'I will look into it.', text: "Oh okay, update me.", isSent: false }
	]);
	const [newMessage, setNewMessage] = useState('');
	const [replyMessage, setReplyMessage] = useState('');
	const [replyUser, setReplyUser] = useState('');

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([...messages, { replyTo: replyUser, replyText: replyMessage, text: newMessage, isSent: true }]);
			setNewMessage('');
			setReplyMessage('');
			setReplyUser('');
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};

	const handleReply = (index) => {
		setReplyMessage(messages[index].text);
		if (!messages[index].isSent)
			setReplyUser("JD");
		else
			setReplyUser("yourself");
	};

	const handleReact = (index) => {
		console.log("React to message:", index);

	};

	const handleDelete = (index) => {
		setMessages(messages.filter((_, i) => i !== index));
	};

	return (
		<div className="chat-window">
			<div className="chat-header">
				<div>{chatPartner}</div>
			</div>
			<div className="message-container">
				{messages.map((message, index) => (
					<Message 
						key={index} 
						text={message.text} 
						isSent={message.isSent}
						replyText={message.replyText}
						replyTo={message.replyTo}
						onReply={() => handleReply(index)}
						onReact={() => handleReact(index)}
						onDelete={() => handleDelete(index)}
					/>
				))}
			</div>
			{
				replyMessage && replyMessage !== '' ?
					<div className="reply-input"><b>Replying to {replyUser}</b>: {replyMessage}</div>
				: null	
			}
			<div className="message-input">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					onKeyDown={handleKeyDown}
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








// function PeopleWhoAddedYouItem({ profilePic, name, onAccept, onRemove }) {
// 	return (
// 		<div className="people-who-added-you-item">
// 			<img className="profile-pic" src={profilePic} alt={`${name}'s profile`} />
// 			<div className="people-details">
// 				<div className="name">{name}</div>
// 				<div className="actions">
// 					<button className="accept-btn" onClick={onAccept}>Accept</button>
// 					<button className="remove-btn" onClick={onRemove}>Remove</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// function SuggestionItem({ profilePic, name, onAddFriend }) {
// 	return (
// 		<div className="suggestion-item">
// 			<img className="profile-pic" src={profilePic} alt={`${name}'s profile`} />
// 			<div className="suggestion-details">
// 				<div className="name">{name}</div>
// 				<button className="add-friend-btn" onClick={onAddFriend}>
// 					Add Friend
// 				</button>
// 			</div>
// 		</div>
// 	);
// }

function SuggestionList()
{
	// const peopleWhoAddedYou = [
	// 	{ name: 'Dave', profilePic: 'https://via.placeholder.com/50' },
	// 	{ name: 'Eve', profilePic: 'https://via.placeholder.com/50' },
	// ];

	// const suggestions = [
	// 	{ name: 'Alice', profilePic: 'https://via.placeholder.com/50' },
	// 	{ name: 'Bob', profilePic: 'https://via.placeholder.com/50' },
	// 	{ name: 'Charlie', profilePic: 'https://via.placeholder.com/50' },
	// ];

	// const handleAcceptFriend = (name) => alert(`${name} has been accepted as a friend.`);
	// const handleRemoveFriend = (name) => alert(`${name} has been removed.`);
	// const handleAddFriend    = (name) => alert(`Friend request sent to ${name}`);

	return (
		<div className={`suggestion-container`}>
			{/*<div className="title-suggest">People Who Added You</div>
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
			</div>*/}
		</div>
	);
}

export default function Chats({isShrunk}) {
	return (
		<div className="chats">
			<TopBar />
			<div className="main-chats">
				<ChatContainer />
				<ChatWindow chatPartner="JD"/>
				<SuggestionList />
			</div>
			<Copyright />
		</div>
	);
}
