import React, { useState, useEffect } from 'react';
import RequestHandler from './Functions/RequestHandler.js';
import './App.scss';

function App()
{
	const handleClick = () => {
		RequestHandler.handleRequest('post', `request_account`)
		.then((res) => {
			alert(res);
		});
	};

	return (
		<button onClick={handleClick}>
			Send Request to Admin
		</button>
	);
}

export default App;
