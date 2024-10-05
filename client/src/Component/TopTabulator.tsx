import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TopTabulator({ searchPlaceholder, buttons }) {
    return (
        <div className="top-tabulator">
            <input className="search" placeholder={searchPlaceholder || "Search..."} />
            <div className="buttons">
                {buttons.map((button, index) => (
                    <div key={index} className={`btn-items ${button.className}`} onClick={button.onClick}>
                        <FontAwesomeIcon icon={button.icon} />
                        <span>{button.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

