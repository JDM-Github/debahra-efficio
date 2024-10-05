import React, {useState} from 'react';
import TopBar     from './TopBar.tsx';
import Copyright  from './Copyright.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

import Tabulator from '../../Component/Tabulator.tsx';
import './Accounts.scss'

const accountsData = [
    {
        id: 1,
        companyName: 'Company 1',
        firstName: 'Unknown 1',
        lastName: 'LastName Unknown 1',
        phone: '123-456-7890',
        email: 'unknown1@example.com',
        address: 'Test Address 1, City 1',
    },
];

const headers = [
    'ID', 'Company Name', 'First Name', 'Last Name', 'Phone', 'Email', 'Address', 'Modify'
];

const actions = [
    { icon: faEdit, className: 'edit-btn', onClick: (id) => console.log(`Edit ID: ${id}`) },
    { icon: faTrash, className: 'delete-btn', onClick: (id) => console.log(`Delete ID: ${id}`) },
];

const buttons = [
    { icon: faPlus, label: "Add Account", className: "add-account", onClick: () => console.log("Add clicked") },
    { icon: faFilter, label: "Filter", className: "filter", onClick: () => console.log("Filter clicked") },
];

const renderRow = (item) => (
    <>
        <td>{item.id}</td>
        <td>{item.companyName}</td>
        <td>{item.firstName}</td>
        <td>{item.lastName}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.address}</td>
    </>
);

export default function Accounts()
{
	return (
		<div className="accounts">
			<TopBar />
			<div className="main-accounts">
				<div className="title">Accounts</div>
				<Tabulator data={accountsData} headers={headers} renderRow={renderRow} actions={actions} buttons={buttons} />
			</div>
			<Copyright />
		</div>
	);
}