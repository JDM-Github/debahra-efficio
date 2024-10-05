import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

import TopTabulator from './TopTabulator.tsx'
import Paginator from './Paginator.tsx'
import './Tabulator.scss'

export default function Tabulator({ data, headers, renderRow, actions, buttons }) {

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<div className="tabulator">
			<TopTabulator searchPlaceholder="Search..." buttons={buttons} />
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							{headers.map((header, index) => (
								<th key={index}>{header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((item, rowIndex) => (
							<tr key={rowIndex}>
								{renderRow(item)}
								{actions && (
									<td>
										<div className="action-buttons">
											{actions.map((action, index) => (
												<button
													key={index}
													className={`${action.className}`}
													onClick={() => action.onClick(item.id)}
												>
													<FontAwesomeIcon icon={action.icon} />
												</button>
											))}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Paginator
                currentPage={currentPage}
                totalItems={data.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
		</div>
	);
}

