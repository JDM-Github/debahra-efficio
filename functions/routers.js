const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const multer = require("multer");

const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
	Chat,
	User,
	AllUserRequest,
	sequelize,
	Service,
	Request,
	Appointment,
} = require("./models");

cloudinary.config({
	cloud_name: "djheiqm47",
	api_key: "692765673474153",
	api_secret: "kT7k8hvxo-bqMWL0aHB2o3k90dA",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function uploadToCloudinary(buffer) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ resource_type: "auto" }, (error, result) => {
				if (error) reject(error);
				else resolve(result.secure_url);
			})
			.end(buffer);
	});
}

// const streamUploadImage = (req) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream((error, result) => {
//             if (result) {
//                 resolve(result);
//             } else {
//                 reject(error);
//             }
//         });
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });
// };

class ChatRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post("/user", expressAsyncHandler(this.getChatByUser));
		this.router.post("/send-chat", expressAsyncHandler(this.updateChats));
		this.router.post("/get-chat", expressAsyncHandler(this.getAllChats));
		// this.router.post(
		//  "/user/:id",
		//  upload.single("image"),
		//  expressAsyncHandler(this.postUserMessage)
		// );
		// this.router.post(
		//  "/admin/reply/:id",
		//  upload.single("image"),
		//  expressAsyncHandler(this.replyToChat)
		// );
		// this.router.get(
		//  "/admin/get_all_chats",
		//  expressAsyncHandler(this.getAllChats)
		// );
	}

	async getChatByUser(req, res) {
		const { id } = req.body;
		let chat = await Chat.findOne({
			where: { userId: id },
			include: [
				{
					model: User,
					attributes: ["username", "email"],
				},
			],
		});

		if (!chat) {
			await Chat.create({ userId: id, messages: [] });
			const user = await User.findOne({ where: { id } });
			chat = {
				userId: id,
				messages: [],
				username: user.username,
				email: user.email,
			};
		}
		res.send({ success: true, chat });
	}

	async updateChats(req, res) {
		const { oldChat } = req.body;
		let chat = await Chat.findOne({
			where: { id: oldChat.id },
		});

		if (!chat) res.send({ success: true, message: "No Chat to update." });

		await chat.update({ messages: oldChat.messages });
		res.send({ success: true, chat });
	}

	async getAllChats(req, res) {
		const chats = await Chat.findAll({
			where: {
				messages: {
					[Op.ne]: [],
				},
			},
			include: {
				model: User,
				attributes: ["username"],
			},
		});
		res.send({ success: true, chats });
	}

	async postUserMessage(req, res) {
		console.log(req.file);
		let chat = await Chat.findOne({ where: { userId: req.params.id } });
		if (!chat) {
			chat = await Chat.create({ userId: req.params.id, messages: [] });
		}
		let imageUrl = null;
		if (req.file) {
			try {
				const result = await streamUploadImage(req);
				imageUrl = result.secure_url;
			} catch (err) {
				imageUrl = null;
				console.error(err.message);
				return res.status(500).send({
					message: "Image upload failed",
					error: err.message,
				});
			}
		}
		const newMessage = {
			image: imageUrl,
			text: req.body.message,
			sender: "user",
			user: req.body.user,
			createdAt: Date.now(),
		};
		const updatedMessages = [...chat.messages, newMessage];
		await chat.update({ messages: updatedMessages });
		res.send(chat);
	}

	async replyToChat(req, res) {
		const chat = await Chat.findOne({ where: { userId: req.params.id } });
		if (chat) {
			let imageUrl = null;
			if (req.file) {
				try {
					const result = await streamUploadImage(req);
					imageUrl = result.secure_url;
				} catch (err) {
					imageUrl = null;
					console.error(err.message);
					return res.status(500).send({
						message: "Image upload failed",
						error: err.message,
					});
				}
			}
			const newMessage = {
				image: imageUrl,
				text: req.body.message,
				sender: "admin",
				user: req.body.user,
				createdAt: Date.now(),
			};
			const updatedMessages = [...chat.messages, newMessage];
			await chat.update({ messages: updatedMessages });
			res.send({ message: "Reply sent", chat, image: imageUrl });
		} else {
			res.status(404).send({ message: "Chat not found" });
		}
	}

	// async getAllChats(req, res) {
	//  const chats = await Chat.findAll({
	//      include: {
	//          model: User,
	//          attributes: ["name", "email"],
	//      },
	//  });
	//  res.send(chats);
	// }
}

class AppointmentRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/get_appointments",
			expressAsyncHandler(this.getAllAppointments)
		);
	}

	async getAllAppointments(req, res) {
		try {
			const { currPage, limit, status } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {};
			if (status != undefined && status !== null) {
				whereClause.status = status;
			}

			const offset = (currPage - 1) * limit;
			const appointment = await Appointment.findAndCountAll({
				where: whereClause,
				include: [
					{
						model: Request,
						include: [
							{
								model: User,
								attributes: ["id", "firstname", "lastname"],
							},
							{
								model: Service,
								attributes: ["serviceName"],
							},
						],
					},
				],
				limit: limit,
				offset: offset,
				order: [["createdAt", "DESC"]],
			});

			res.json({
				success: true,
				data: appointment.rows,
				total: appointment.count,
				currentPage: currPage,
				totalPages: Math.ceil(appointment.count / limit),
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching requests",
			});
		}
	}
}

class RequestRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/request-json",
			expressAsyncHandler(this.requestJSON)
		);
		this.router.post(
			"/request-document",
			upload.single("serviceFile"),
			expressAsyncHandler(this.requestDocument)
		);
		this.router.post(
			"/get_request",
			expressAsyncHandler(this.getAllRequest)
		);
		this.router.post(
			"/view_service",
			expressAsyncHandler(this.viewService)
		);
		this.router.post(
			"/set_archived",
			expressAsyncHandler(this.setArchived)
		);
		this.router.post(
			"/accept_request",
			expressAsyncHandler(this.acceptRequest)
		);
	}

	async setArchived(req, res) {
		try {
			const { id } = req.body;

			const request = await Request.findOne({
				where: { id },
			});

			if (!request) {
				return res.status(404).json({
					success: false,
					message: "Request not found",
				});
			}
			const newArchivedStatus = !request.isArchived;
			await request.update({ isArchived: newArchivedStatus });

			res.json({
				success: true,
				message: `Successfully ${
					newArchivedStatus === "true" ? "archived" : "unarchived"
				} the request`,
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while archiving requests",
			});
		}
	}

	async acceptRequest(req, res) {
		try {
			const { id, appointmentData } = req.body;
			const request = await Request.findOne({
				where: { id },
			});

			if (!request) {
				return res.status(404).json({
					success: false,
					message: "Request not found",
				});
			}
			await request.update({ isVerified: true });
			await Appointment.create({
				requestId: id,
				appointmentDate: new Date(appointmentData.date),
				status: "ONGOING",
				appointmentPeople: appointmentData.people,
				appointmentNotes: appointmentData.notes,
			});

			res.json({
				success: true,
				message:
					"The request is successfully sent. The appointment was sent!",
			});
		} catch (error) {
			console.error("Error fetching requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while verifying requests",
			});
		}
	}

	async viewService(req, res) {
		const { id } = req.body;

		try {
			const request = await Request.findOne({ where: { id } });

			res.send({
				success: true,
				data: request,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while viewing the request. ${error}`,
			});
		}
	}

	async requestJSON(req, res) {
		const { userId, serviceId, serviceName, serviceForm } = req.body;

		try {
			await Request.create({
				userId: userId,
				serviceRequestId: serviceId,
				serviceForm: serviceForm,
			});

			res.send({
				success: true,
				message: `Service request: "${serviceName}" was sent successfully. Please wait for further notice.`,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error}`,
			});
		}
	}

	async requestDocument(req, res) {
		const { userId, serviceId, serviceName } = req.body;
		const serviceFile = req.file;

		try {
			const uploadedUrl = await uploadToCloudinary(serviceFile.buffer);

			await Request.create({
				userId: userId,
				serviceRequestId: serviceId,
				uploadedDocument: uploadedUrl,
			});
			``;
			res.send({
				success: true,
				message: `Service request: "${serviceName}" was sent successfully. Please wait for further notice.`,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error.message}`,
			});
		}
	}

	async getAllRequest(req, res) {
		try {
			const { currPage, limit, isArchived } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {
				status: {
					[Op.ne]: "COMPLETE",
				},
				isVerified: false,
			};
			if (isArchived !== null) {
				whereClause.isArchived = isArchived;
			}

			const offset = (currPage - 1) * limit;
			const requests = await Request.findAndCountAll({
				where: whereClause,
				include: [
					{
						model: User,
						attributes: ["id", "firstname", "lastname"],
					},
					{
						model: Service,
						attributes: ["serviceName"],
					},
				],
				limit: limit,
				offset: offset,
				order: [["createdAt", "DESC"]],
			});

			res.json({
				success: true,
				data: requests.rows,
				total: requests.count,
				currentPage: currPage,
				totalPages: Math.ceil(requests.count / limit),
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching requests",
			});
		}
	}
}

class ServiceRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/get_services",
			expressAsyncHandler(this.getAllService)
		);
	}
	async getAllService(req, res) {
		const services = await Service.findAll({});
		res.send({ success: true, services });
	}
}

class UserRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post("/login", expressAsyncHandler(this.getUser));
		this.router.post("/request", expressAsyncHandler(this.sendRequest));
		this.router.post(
			"/get_request",
			expressAsyncHandler(this.getAllRequest)
		);
		this.router.post(
			"/get_accounts",
			expressAsyncHandler(this.getAllAccounts)
		);
		this.router.post(
			"/set_archived",
			expressAsyncHandler(this.setArchived)
		);
		this.router.post(
			"/accept_request",
			expressAsyncHandler(this.acceptRequest)
		);
		this.router.post("/get_user", expressAsyncHandler(this.getUserByID));
	}

	async sendRequest(req, res) {
		const { email, password, confirmPassword } = req.body;
		if (email === "" || password === "" || confirmPassword === "") {
			res.send({
				success: false,
				message: "Form input can't be empty.",
			});
			return;
		}
		if (password != confirmPassword) {
			res.send({
				success: false,
				message: "Password does not match.",
			});
			return;
		}
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		if (!passwordRegex.test(password)) {
			res.send({
				success: false,
				message:
					"Password must be longer than 8 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
			});
			return;
		}
		const user = await AllUserRequest.findOne({
			where: { email: email },
		});
		if (user) {
			if (user.isVerified === true) {
				res.send({
					success: false,
					message: `User already exist and is verified.`,
				});
				return;
			}
			res.send({
				success: false,
				message:
					"User request already sent. Please wait for admin approval.",
			});
			return;
		}

		try {
			await AllUserRequest.create({
				email: email,
				password: await bcrypt.hash(password, 10),
				isVerified: false,
			});

			res.send({
				success: true,
				message:
					"User request sent successfully. Please wait for admin approval.",
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the user request. ${error}`,
			});
		}
	}

	async getUserByID(req, res) {
		const { id } = req.body;

		try {
			let user = await User.findOne({ where: { id } });
			if (!user) {
				return res.status(404).send({
					success: false,
					message: "User does not exist.",
				});
			}
			res.send({
				success: true,
				user,
			});
		} catch (error) {
			res.status(500).send({
				success: false,
				message: "An error occurred while fetching the user.",
			});
		}
	}

	async getUser(req, res) {
		const { email, password } = req.body;
		if (email === "" || password === "") {
			res.send({
				success: false,
				message: "Email or password can't be empty.",
			});
			return;
		}
		let user = await User.findOne({ where: { email: email } });
		if (!user) {
			const verifiedUser = await AllUserRequest.findOne({
				where: { email: email },
			});
			if (!verifiedUser) {
				return res.send({
					success: false,
					message:
						"User does not exist. Request an account from admin.",
				});
			}
			if (verifiedUser.isVerified === false) {
				return res.send({
					success: false,
					message:
						"User is not verified. Please wait for admin approval.",
				});
			}

			if (!(await bcrypt.compare(password, verifiedUser.password))) {
				return res.json({
					success: false,
					message: "Email or password is invalid.",
				});
			}

			user = await User.create({
				username: `User-${verifiedUser.id}`,
				email: verifiedUser.email,
				password: verifiedUser.password,
			});
		} else {
			if (!(await bcrypt.compare(password, user.password))) {
				return res.json({
					success: false,
					message: "Email or password is invalid.",
				});
			}
		}

		return res.json({
			success: true,
			message: "Successfully logged in!",
			user: user,
		});
	}

	async acceptRequest(req, res) {
		try {
			const { id } = req.body;

			const request = await AllUserRequest.findOne({
				where: { id },
			});

			if (!request) {
				return res.status(404).json({
					success: false,
					message: "Request not found",
				});
			}

			await request.update({ isVerified: true });

			res.json({
				success: true,
				message:
					"Account request successfully verified. The user account will be created upon user login.",
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while verifying account requests",
			});
		}
	}

	async setArchived(req, res) {
		try {
			const { id } = req.body;

			const request = await AllUserRequest.findOne({
				where: { id },
			});

			if (!request) {
				return res.status(404).json({
					success: false,
					message: "Request not found",
				});
			}

			const newArchivedStatus = !request.isArchived;
			await request.update({ isArchived: newArchivedStatus });

			res.json({
				success: true,
				message: `Successfully ${
					newArchivedStatus === "true" ? "archived" : "unarchived"
				} the request`,
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while archiving requests",
			});
		}
	}

	async getAllRequest(req, res) {
		try {
			const { currPage, limit, isArchived } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {
				isVerified: false,
			};

			if (isArchived !== null) {
				whereClause.isArchived = isArchived;
			}

			const offset = (currPage - 1) * limit;
			const requests = await AllUserRequest.findAndCountAll({
				where: whereClause,
				limit: limit,
				offset: offset,
				order: [["createdAt", "DESC"]],
			});

			res.json({
				success: true,
				data: requests.rows,
				total: requests.count,
				currentPage: currPage,
				totalPages: Math.ceil(requests.count / limit),
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching requests",
			});
		}
	}

	async getAllAccounts(req, res) {
		try {
			const { currPage, limit } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const offset = (currPage - 1) * limit;
			const requests = await User.findAndCountAll({
				limit: limit,
				offset: offset,
				order: [["createdAt", "DESC"]],
			});

			res.json({
				success: true,
				data: requests.rows,
				total: requests.count,
				currentPage: currPage,
				totalPages: Math.ceil(requests.count / limit),
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching requests",
			});
		}
	}
}

const userRouter = new UserRouter().router;
const chatRouter = new ChatRouter().router;
const reqRouter = new RequestRouter().router;
const servRouter = new ServiceRouter().router;
const appointmentRouter = new AppointmentRouter().router;
module.exports = {
	userRouter,
	chatRouter,
	reqRouter,
	servRouter,
	appointmentRouter,
	sequelize,
};
