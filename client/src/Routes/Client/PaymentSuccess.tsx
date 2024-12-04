import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequestHandler from "../../Functions/RequestHandler";

export default function PaymentSuccess() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const isRequestSent = useRef(false);
	const handleRequest = async (parseBody) => {
		try {
			console.log(parseBody);
			const data = await RequestHandler.handleRequest(
				"post",
				"request/request-document",
				{
					userId: parseBody.userId,
					serviceId: parseBody.serviceId,
					serviceName: parseBody.serviceName,
					imageUrl: parseBody.imageUrl,
				}
			);
			if (data.success) {
				toast.success("Payment success.");
				navigate("/client/pending-request", { replace: true });
			} else {
				toast.error("Payment failed.");
				navigate("/client/services", { replace: true });
			}
		} catch (error) {
			toast.error("Error submitting the document");
			navigate("/client/services", { replace: true });
		}
	};

	useEffect(() => {
		if (isRequestSent.current) return;
		isRequestSent.current = true;

		const body = searchParams.get("body");
		if (body) {
			const parseBody = JSON.parse(decodeURIComponent(body));
			handleRequest(parseBody);
		} else {
			toast.error("Payment failed.");
			navigate("/client/services", { replace: true });
		}
	}, [searchParams, navigate]);

	return <div></div>;
}
