import React, {useState} from 'react';
import TopBar     from './TopBar.tsx';
import Copyright  from './Copyright.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faEdit, faTrash, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

import Tabulator from '../../Component/Tabulator.tsx';
import './Requests.scss'


const requestData = [
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    },
    {
        id: 1,
        companyName: 'Company 1',
        serviceRequest: 'SSS Payment',
        status: 'ONGOING'
    }
];

const headers = [
    'ID', 'Company Name', 'Service Request', 'Status', 'Modify'
];

const actions = [
    { icon: faEye, className: 'view-btn', onClick: (id) => console.log(`Edit ID: ${id}`) },
    { icon: faCheck, className: 'done-btn', onClick: (id) => console.log(`Delete ID: ${id}`) },
];

const renderRow = (item) => (
    <>
        <td>{item.id}</td>
        <td>{item.companyName}</td>
        <td>{item.serviceRequest}</td>
        <td>{item.status}</td>
    </>
);

const buttons = [
    { icon: faPlus, label: "Add Requests", className: "add-account", onClick: () => console.log("Add clicked") },
    { icon: faFilter, label: "Filter", className: "filter", onClick: () => console.log("Filter clicked") },
];

export default function Requests()
{
	return (
		<div className="requests">
			<TopBar />
			<div className="main-requests">
				<div className="title">Requests</div>
				<Tabulator data={requestData} headers={headers} renderRow={renderRow} actions={actions} buttons={buttons}/>
			</div>
			<Copyright />
		</div>
	);
}
