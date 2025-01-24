const express = require("express");
const cors = require("cors");
const axios = require("axios");
const serverless = require("serverless-http");
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("./emailSender");

const expressAsyncHandler = require("express-async-handler");

const { sequelize, User, Request, Service, Transaction } = require("./models");
const {
	userRouter,
	chatRouter,
	reqRouter,
	servRouter,
	appointmentRouter,
	imageRouter,
} = require("./routers.js");

function sendEmailToUser(email, subject, text, body) {
	const emailSubject = subject;
	const emailText = text;
	const emailHtml = body;
	sendEmail(email, emailSubject, emailText, emailHtml, (error, info) => {
		
	});
}

class App {
	constructor() {
		this.app = express();
		this.router = express.Router();
		this.DEVELOPMENT = true;

		this.setupMiddleware();
		this.setupRoutes();
	}

	setupMiddleware() {
		if (this.DEVELOPMENT) {
			this.app.use(
				cors({
					origin: "http://localhost:3000",
					credentials: true,
					optionSuccessStatus: 200,
				})
			);
		} else {
			this.app.use(cors());
		}

		this.app.use(bodyParser.json());
		this.app.use(express.json());
		this.app.use(express.static(path.join(__dirname, "../client/build")));
	}

	setupRoutes() {
		this.router.use("/users", userRouter);
		this.router.use("/chats", chatRouter);
		this.router.use("/request", reqRouter);
		this.router.use("/service", servRouter);
		this.router.use("/image", imageRouter);
		this.router.use("/appointment", appointmentRouter);

		this.router.get("/reset", expressAsyncHandler(this.reset));
		this.router.get("/payment-success", async (req, res) => {
			const { target, amount, token } = req.query;

			if (!token) {
				return res
					.status(400)
					.json({ error: "Payment token is missing" });
			}

			try {
				const captureRequest = new paypal.orders.OrdersCaptureRequest(
					token
				);
				const captureResponse = await client.execute(captureRequest);

				if (captureResponse.result.status !== "COMPLETED") {
					return res
						.status(400)
						.json({ error: "Payment not completed" });
				}

				const request = await Request.findByPk(target, {
					include: [
						{
							model: User,
							attributes: ["id", "firstname", "lastname", "email"],
						},
						{
							model: Service,
							attributes: ["serviceName"],
						},
					],
				});
				if (!request) {
					return res.status(404).json({ error: "Request not found" });
				}
				

				const subject = "Payment Confirmation";
				const text = `Dear ${request.User.firstname} ${request.User.lastname},\n\nThank you for your payment of $${amount}. Your payment has been successfully processed.`;
				const body = `
					<h1>Payment Confirmation</h1>
					<p>Dear ${request.User.firstname} ${request.User.lastname},</p>
					<p>Thank you for your payment of <strong>$${amount}</strong>. Your payment has been successfully processed for the service: <strong>${
					request.Service.serviceName
				}</strong>.</p>
					<p>Payment Details:</p>
					<ul>
						<li>Amount Paid: $${amount}</li>
						<li>Total Paid: $${Math.min(request.paidAmount, request.price)}</li>
						<li>Remaining Balance: $${
							request.price -
							Math.min(request.paidAmount, request.price)
						}</li>
					</ul>
					<p>We appreciate your business!</p>
					`;
				sendEmailToUser(request.User.email, subject, text, body);
				await request.update({
					paidAmount: Math.min(
						request.paidAmount + amount,
						request.price
					),
				});

				await Transaction.create({
					userId: request.userId,
					assignedEmployee: request.assignedEmployee,
					requestId: request.id,
					typeOfTransaction: "PAYMENT",
					amount: amount,
					referenceNumber: uuidv4(),
				});

				res.redirect(`https://debahra.netlify.app/client/ongoing-request?message=success`);
			} catch (error) {
				console.error("Error capturing payment:", error);
				res.status(500).json({ error: "Failed to process payment" });
			}
		});

		this.router.get("/payment-failed", async (req, res) => {
			try {
				res.redirect(
					"https://debahra.netlify.app/client/ongoing-request?message=failed"
				);
			} catch (error) {
				console.error("Error handling payment failure:", error);
				res.status(500).json({
					error: "Failed to process payment failure",
				});
			}
		});


		this.router.post("/example", expressAsyncHandler(this.example));

		this.router.post("/request_account", this.requestAccount);
		this.router.get("*", this.handleCatchAll);
		this.app.use("/.netlify/functions/api", this.router);

		this.router.post("/send-email", (req, res) => {
			const { email, subject, text, body } = req.body;

			if (!email || !verificationCode) {
				return res.status(400).json({
					success: false,
					message:
						"Recipient email and verification code are required.",
				});
			}

			const emailSubject = subject;
			const emailText = text;

			const emailHtml = body;

			sendEmail(
				email,
				emailSubject,
				emailText,
				emailHtml,
				(error, info) => {
					if (error) {
						console.log("Error sending email:", error);
						return res.status(500).json({
							success: false,
							message: "Failed to send email.",
							error: error.message,
						});
					}

					console.log("Email sent successfully:", info);
					return res.status(200).json({
						success: true,
						message: "Verification email sent successfully.",
						info: info.messageId,
					});
				}
			);
		});

		const paypal = require("@paypal/checkout-server-sdk");
		const PAYPAL_CLIENT_ID =
			"Af0tB87keOdzXZpl_Ib8lb86Udu5oTWSL-xHDwAz4q9GiBQSFbejrkAqY2QQU5XAlYJ5PyFc6wsM45Wq";
		const PAYPAL_CLIENT_SECRET =
			"EO6ufyuol6bxnX_E9HV9OmpqgD9SCWI5AEEohSaLYjBpJqbsVzv650YBQDWk7mZgPIPqE0IRpoQ5Gcyu";
		const environment = new paypal.core.SandboxEnvironment(
			PAYPAL_CLIENT_ID,
			PAYPAL_CLIENT_SECRET
		);

		const client = new paypal.core.PayPalHttpClient(environment);
		this.router.post("/create-payment", async (req, res) => {
			const { amount, targetServiceId } = req.body;
			const baseUrl = `https://${req.get("host")}`;
			try {
				const formattedAmount = parseFloat(amount);
				if (isNaN(formattedAmount) || amount <= 0) {
					throw new Error("Invalid amount provided");
				}

				const orderRequest = new paypal.orders.OrdersCreateRequest();
				orderRequest.requestBody({
					intent: "CAPTURE",
					purchase_units: [
						{
							amount: {
								currency_code: "PHP",
								value: formattedAmount.toFixed(2),
							},
							description: "Payment description",
						},
					],
					application_context: {
						brand_name: "EFFICIO",
						landing_page: "BILLING",
						user_action: "PAY_NOW",
						return_url: `${baseUrl}/.netlify/functions/api/payment-success?target=${targetServiceId}&amount=${formattedAmount}`,
						cancel_url: `${baseUrl}/.netlify/functions/api/payment-failed`,
					},
				});
				const order = await client.execute(orderRequest);
				const approvalUrl = order.result.links.find(
					(link) => link.rel === "approve"
				).href;

				res.json({
					redirectUrl: approvalUrl,
				});
			} catch (error) {
				console.error("Error creating PayPal payment:", error);
				res.status(500).json({
					error: "Failed to create PayPal payment",
				});
			}
		});
	}

	requestAccount(req, res) {
		console.log("REQUEST TO ADMIN");
		res.json("REQUEST TO ADMIN IS SUCCESS");
	}

	handleCatchAll(req, res) {
		res.sendFile(path.join(__dirname, "../client/build", "index.html"));
	}

	async reset(req, res) {
		await sequelize.sync({ force: true });
		res.send("RESET DATABASE");
	}

	async example(req, res) {
		res.send("EXAMPLE");
	}

	start() {
		return serverless(this.app);
	}
}

const appInstance = new App();
module.exports.handler = appInstance.start();
