import React, { useEffect } from "react";
// import "./Dashboard.scss";
// import Copyright from "../../Component/Copyright.tsx";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const bg = require("../../Assets/logo.png");

export default function Dashboard() {
	useEffect(() => {
		localStorage.clear();
		const message = sessionStorage.getItem("error-message");
		if (message) toast.error(message);
	}, []);

	return (
		<div className="w-[100vw] h-screen overflow-x-hidden">
			<ToastContainer />

			{/* Navigation Bar */}
			<nav className="flex justify-between items-center p-2 bg-green-800 text-white w-full mt-4 px-32">
				<div className="text-4xl font-bold">EFFICIO</div>
				<ul className="flex space-x-16 justify-center items-center">
					<li className="text-xl">Home</li>
					<li className="text-xl">Services</li>
					<li className="text-xl">About Us</li>
					<li className="text-xl bg-green-600 px-6 py-3 rounded-lg cursor-pointer">
						Contact Us
					</li>
				</ul>
			</nav>

			{/* Company Image */}
			<div className="flex justify-center items-center mt-4 shadow-lg">
				<img
					src={bg} // Replace with your company's image URL
					alt="Company Image"
					className="w-full px-32 h-[50vh] object-cover"
				/>
			</div>

			{/* Design Grid */}
			<div className="w-5/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-32 p-8 mt-1">
				{/* Column 1: Text Section */}
				<div className="col-span-1 lg:col-span-1 p-6 rounded-lg  text-center">
					<h2 className="text-3xl font-bold text-left">
						Simplifying Permits & Taxes
					</h2>
					<p className="mt-4 text-gray-600 text-left">
						We help streamline the process of acquiring permits and
						handling taxes efficiently, ensuring a hassle-free
						experience for you.
					</p>
					<NavLink to="login">
						<div className="w-full font-bold text-3x1 mt-6 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-200">
							GET STARTED {">"}
						</div>
					</NavLink>
				</div>

				{/* Column 2: Service 1 */}
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnOU0iPrhLJH7CQPgYM3Q-x7umeizS7holgw&s"
					alt="Service Card"
					className="bg-white p-6 rounded-lg shadow-xl text-center border-r-8 border-b-4 border-green-600 h-72 w-full object-cover transform transition-transform duration-200 hover:scale-105"
				/>

				{/* Column 2: Service 2 */}
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-JYXALwOtzTc34YlgNgGmNvpab4oxo0lfGQ&s"
					alt="Service Card"
					className="bg-white p-6 rounded-lg shadow-xl text-center border-r-8 border-b-4 border-green-600 h-72 w-full object-cover transform transition-transform duration-200 hover:scale-105"
				/>

				{/* Column 3: Service 3 */}
				<img
					src="https://25174313.fs1.hubspotusercontent-eu1.net/hubfs/25174313/assets_moneymax/PagIBIG_Salary_Loan_1.jpg"
					alt="Service Card"
					className="bg-white p-6 rounded-lg shadow-xl text-center border-r-8 border-b-4 border-green-600 h-72 w-full object-cover transform transition-transform duration-200 hover:scale-105"
				/>
			</div>
		</div>
	);
}
