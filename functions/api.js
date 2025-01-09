const express = require("express");
const cors = require("cors");
const axios = require("axios");
const serverless = require("serverless-http");
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const expressAsyncHandler = require("express-async-handler");

const { sequelize, User } = require("./models");
const {
	userRouter,
	chatRouter,
	reqRouter,
	servRouter,
	appointmentRouter,
	imageRouter,
} = require("./routers.js");

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
			const { amount, userId, body } = req.body;
			try {
				const formattedAmount = parseFloat(amount);
				if (isNaN(formattedAmount)) {
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
						return_url: `https://debahra.netlify.app/client/payment-success?user=${userId}&body=${encodeURIComponent(
							JSON.stringify(body)
						)}`,
						cancel_url: `https://debahra.netlify.app/client/payment-failed?user=${userId}`,
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
