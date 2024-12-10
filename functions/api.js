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

		const PAYMONGO_API_KEY = "sk_test_PoK58FtMrQaHHc2EyguAKYwj";
		this.router.post("/create-payment", async (req, res) => {
			const { amount, userId, body } = req.body;
			try {
				const sourceResponse = await axios.post(
					"https://api.paymongo.com/v1/sources",
					{
						data: {
							attributes: {
								amount: amount * 100,
								currency: "PHP",
								type: "gcash",
								redirect: {
									success: `https://debahra.netlify.app/client/payment-success?user=${userId}&body=${encodeURIComponent(
										JSON.stringify(body)
									)}`,
									expired: `https://debahra.netlify.app/client/payment-failed?user=${userId}`,
									failed: `https://debahra.netlify.app/client/payment-failed?user=${userId}`,
								},
							},
						},
					},
					{
						headers: {
							Authorization: `Basic ${Buffer.from(
								PAYMONGO_API_KEY
							).toString("base64")}`,
							"Content-Type": "application/json",
						},
					}
				);
				const gcashSource = sourceResponse.data.data;
				res.json({
					redirectUrl: gcashSource.attributes.redirect.checkout_url,
				});
			} catch (error) {
				console.error("Error creating payment:", error);
				res.status(500).json({
					error: "Failed to create GCash payment",
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
