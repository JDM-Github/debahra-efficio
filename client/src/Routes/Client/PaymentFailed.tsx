import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/client/services?payment-failed=Error");
	});
	return <div>PAYMENT FAILED</div>;
}
