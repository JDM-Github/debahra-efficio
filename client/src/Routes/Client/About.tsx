import React from "react";
import TopBar from "../../Component/TopBar.tsx";
import Copyright from "../../Component/Copyright.tsx";
import "./About.scss";

export default function Dashboard({ changeURL }) {
	return (
		<div className={`about`}>
			<TopBar clickHandler={() => changeURL("profile")} />
			<div className="main-about"></div>
			<Copyright />
		</div>
	);
}
