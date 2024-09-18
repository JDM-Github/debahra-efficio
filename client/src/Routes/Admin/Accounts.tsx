import React from 'react';
import './Accounts.scss'

function AccountsTabulator( { accountsData } ) {
	const handleEdit   = (id: number) => console.log(`Edit account with ID: ${id}`);
	const handleDelete = (id: number) => console.log(`Delete account with ID: ${id}`);

	return (
		<div className="accounts-tabulator">
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Company Name</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Address</th>
						<th>Modify</th>
					</tr>
				</thead>
				<tbody>
					{accountsData.map((account) => (
						<tr key={account.id}>
							<td>{account.id}</td>
							<td>{account.companyName}</td>
							<td>{account.firstName}</td>
							<td>{account.lastName}</td>
							<td>{account.phone}</td>
							<td>{account.email}</td>
							<td>{account.address}</td>
							<td>
								<button className="edit-btn" onClick={() => handleEdit(account.id)}>EDIT</button>
								<button className="delete-btn" onClick={() => handleDelete(account.id)}>DELETE</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function Accounts()
{
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
		{
			id: 2,
			companyName: 'Company 2',
			firstName: 'Unknown 2',
			lastName: 'LastName Unknown 2',
			phone: '987-654-3210',
			email: 'unknown2@example.com',
			address: 'Test Address 2, City 2',
		},
		{
			id: 3,
			companyName: 'Company 3',
			firstName: 'Unknown 3',
			lastName: 'LastName Unknown 3',
			phone: '555-123-4567',
			email: 'unknown3@example.com',
			address: 'Test Address 3, City 3',
		},
		{
			id: 4,
			companyName: 'Company 4',
			firstName: 'Unknown 4',
			lastName: 'LastName Unknown 4',
			phone: '555-987-6543',
			email: 'unknown4@example.com',
			address: 'Test Address 4, City 4',
		},
		{
			id: 5,
			companyName: 'Company 5',
			firstName: 'Unknown 5',
			lastName: 'LastName Unknown 5',
			phone: '555-654-3210',
			email: 'unknown5@example.com',
			address: 'Test Address 5, City 5',
		},
		{
			id: 6,
			companyName: 'Company 6',
			firstName: 'Unknown 6',
			lastName: 'LastName Unknown 6',
			phone: '555-321-6540',
			email: 'unknown6@example.com',
			address: 'Test Address 6, City 6',
		},
	];
	return (
		<div className="accounts">
			<div className="title">ADMIN CHATS</div>
			<AccountsTabulator accountsData={accountsData}/>
		</div>
	);
}