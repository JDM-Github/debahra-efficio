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
	Employee,
	Transaction,
	ActivityLog,
} = require("./models");
const sendEmail = require("./emailSender");

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

function sendEmailToUser(email, subject, text, body) {
	const emailSubject = subject;
	const emailText = text;
	const emailHtml = body;
	sendEmail(email, emailSubject, emailText, emailHtml, (error, info) => {
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
	});
}
// Helper function to generate a unique reference number (adjust as needed)
function generateReferenceNumber() {
	return "REF" + Math.random().toString(36).substr(2, 9).toUpperCase();
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

async function createChatDict(messages) {
	const chatList = [];

	for (const key in messages) {
		const staffId = key.replace("staff", "");
		if (staffId == "admin") continue;
		const user = await User.findByPk(staffId, {
			attributes: [
				"id",
				"username",
				"firstname",
				"lastname",
				"profileImg",
			],
		});
		if (user) {
			const chatEntry = {
				ids: staffId,
				profilePic: user.profileImg,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				messages: messages[key],
			};
			chatList.push(chatEntry);
		}
	}
	return chatList;
}

class ChatRouter {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post("/user", expressAsyncHandler(this.getChatByUser));
		this.router.post("/send-chat", expressAsyncHandler(this.updateChats));
		this.router.post("/get-chat", expressAsyncHandler(this.getAllChats));
		this.router.post(
			"/get-chat-employee",
			expressAsyncHandler(this.getChatsForAssignedUsers)
		);
		this.router.post(
			"/get-chat-user",
			expressAsyncHandler(this.getChatsForAssignedStaff)
		);
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

	async getChatsForAssignedUsers(req, res) {
		const { employeeId } = req.body;
		try {
			const employee = await Employee.findOne({
				where: { userId: employeeId },
			});
			if (!employee) {
				throw new Error("Employee not found");
			}
			const assignedUserIds = employee.assignedUser;
			const chats = await Chat.findAll({
				where: {
					userId: {
						[Op.in]: assignedUserIds,
					},
				},
				include: [
					{
						model: User,
						attributes: ["username", "email"],
					},
				],
			});
			res.send({ success: true, chats });
		} catch (error) {
			res.send({
				success: false,
				message: `Error getting chats for assigned users: ${error}`,
			});
		}
	}

	async getChatsForAssignedStaff(req, res) {
		const { id } = req.body;
		try {
			const chats = await Chat.findOne({
				where: { userId: id },
			});
			const chatList = await createChatDict(chats.messages);
			res.send({ success: true, chats: chatList });
		} catch (error) {
			res.send({
				success: false,
				message: `Error getting chats for assigned users: ${error}`,
			});
		}
	}

	async getChatByUser(req, res) {
		const { id } = req.body;

		let chat = await Chat.findOne({
			where: {
				userId: id,
			},
			include: [
				{
					model: User,
					attributes: ["username", "email"],
				},
			],
		});

		if (chat) {
			res.send({
				success: true,
				chats: chat,
			});
		} else {
			res.send({
				success: false,
				message: "Chat not found for the specified user.",
			});
		}
	}

	// async chatToAdmin(req, res) {
	// 	const { id } = req.body;
	// 	let chat = await Chat.findOne({
	// 		where: { userId: id },
	// 		include: [
	// 			{
	// 				model: User,
	// 				attributes: ["username", "email"],
	// 			},
	// 		],
	// 	});

	// 	if (!chat) {
	// 		await Chat.create({ userId: id, messages: [] });
	// 		const user = await User.findOne({ where: { id } });
	// 		chat = {
	// 			userId: id,
	// 			messages: [],
	// 			username: user.username,
	// 			email: user.email,
	// 		};
	// 		console.log(chat);
	// 	}
	// 	res.send({ success: true, chat });
	// }

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
		const { isEmployee } = req.body;
		const chats = await Chat.findAll({
			where: {
				messages: {
					[Op.ne]: [],
				},
			},
			include: {
				model: User,
				attributes: ["username", "isEmployee"],
			},
		});
		const filteredChats = chats.filter(
			(chat) => chat.User.isEmployee === isEmployee
		);
		res.send({ success: true, chats: filteredChats });
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
		// this.router.post(
		// 	"/get_employee_appointments",
		// 	expressAsyncHandler(this.getAllAppointments)
		// );
	}

	async getAllAppointments(req, res) {
		try {
			const { userEmail, staffId, currPage, limit, status } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}
			const whereClause = {};
			if (staffId != undefined && staffId !== null) {
				whereClause.staffId = staffId;
			}
			if (userEmail != undefined && userEmail !== null) {
				whereClause.userEmail = userEmail;
			}
			const offset = (currPage - 1) * limit;

			// REQUEST ONLY APPOINTED
			let appointment = await Appointment.findAndCountAll({
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

			const appointment2 = appointment.rows.filter(
				(app) => app.Request.status === "APPOINTED"
			);

			res.json({
				success: true,
				data: appointment2,
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
			expressAsyncHandler(this.requestDocument)
		);
		this.router.post(
			"/upload-image",
			upload.single("file"),
			expressAsyncHandler(this.uploadImageToCloudinary)
		);
		this.router.post(
			"/get_request",
			expressAsyncHandler(this.getAllRequest)
		);
		this.router.post(
			"/get_request_ongoing",
			expressAsyncHandler(this.getAllOngoingRequest)
		);
		// this.router.post(
		// 	"/get_request_ongoing_user",
		// 	expressAsyncHandler(this.getAllOngoingRequestUser)
		// );
		this.router.post(
			"/get_request_completed",
			expressAsyncHandler(this.getAllCompletedRequest)
		);
		this.router.post(
			"/get_all_transaction",
			expressAsyncHandler(this.getAllTransaction)
		);
		this.router.post(
			"/get_all_assigned_user",
			expressAsyncHandler(this.getAllAssignedUser)
		);
		this.router.post(
			"/get_all_transaction_user",
			expressAsyncHandler(this.getAllTransactionUser)
		);
		this.router.post(
			"/get_all_activity",
			expressAsyncHandler(this.getAllActivityLog)
		);
		this.router.post(
			"/view_service",
			expressAsyncHandler(this.viewService)
		);
		this.router.post(
			"/view_user_service",
			expressAsyncHandler(this.viewUserService)
		);
		this.router.post(
			"/set_archived",
			expressAsyncHandler(this.setArchived)
		);
		this.router.post(
			"/accept_request",
			expressAsyncHandler(this.acceptRequest)
		);
		this.router.post(
			"/add-transaction",
			expressAsyncHandler(this.addToTransaction)
		);
		this.router.post(
			"/add-progress",
			expressAsyncHandler(this.addProgressStep)
		);
		this.router.post(
			"/check-confirm-transaction",
			expressAsyncHandler(this.confirmRequest)
		);
		this.router.post(
			"/completeRequest",
			expressAsyncHandler(this.completeRequest)
		);
		this.router.post(
			"/setAppointment",
			expressAsyncHandler(this.setAppointment)
		);
		this.router.post("/load_admin", expressAsyncHandler(this.load_admin));
	}

	async load_admin(req, res) {
		try {
			const { Op } = require("sequelize");
			const endDate = new Date();
			const startDate = new Date();
			startDate.setDate(endDate.getDate() - 7 * 7);

			const transactions = await Transaction.findAll({
				attributes: [
					[
						sequelize.fn(
							"DATE_TRUNC",
							"week",
							sequelize.col("createdAt")
						),
						"weekStart",
					],
					[
						sequelize.fn("SUM", sequelize.col("amount")),
						"totalRevenue",
					],
				],
				where: {
					createdAt: {
						[Op.between]: [startDate, endDate],
					},
				},
				group: [
					sequelize.fn(
						"DATE_TRUNC",
						"week",
						sequelize.col("createdAt")
					),
				],
				order: [
					[
						sequelize.fn(
							"DATE_TRUNC",
							"week",
							sequelize.col("createdAt")
						),
						"ASC",
					],
				],
			});

			const revenueData = {
				labels: [
					"Week 1",
					"Week 2",
					"Week 3",
					"Week 4",
					"Week 5",
					"Week 6",
					"Week 7",
				],
				datasets: [
					{
						label: "Revenue (₱)",
						data: Array(7).fill(0),
						borderColor: "#34D399",
						backgroundColor: "rgba(52, 211, 153, 0.2)",
						fill: true,
						tension: 0.4,
					},
				],
			};

			transactions.forEach((transaction) => {
				const weekIndex = Math.floor(
					(new Date(transaction.dataValues.weekStart) - startDate) /
						(7 * 24 * 60 * 60 * 1000)
				);
				if (weekIndex >= 0 && weekIndex < 7) {
					revenueData.datasets[0].data[weekIndex] = parseFloat(
						transaction.dataValues.totalRevenue
					);
				}
			});

			const salesTransactions = await Transaction.findAll({
				attributes: [
					[
						sequelize.fn(
							"DATE_TRUNC",
							"month",
							sequelize.col("createdAt")
						),
						"monthStart",
					],
					[
						sequelize.fn("SUM", sequelize.col("amount")),
						"totalSales",
					],
				],
				where: {
					createdAt: {
						[Op.gte]: new Date(new Date().getFullYear(), 0, 1), 
					},
				},
				group: [
					sequelize.fn(
						"DATE_TRUNC",
						"month",
						sequelize.col("createdAt")
					),
				],
				order: [
					[
						sequelize.fn(
							"DATE_TRUNC",
							"month",
							sequelize.col("createdAt")
						),
						"ASC",
					],
				],
			});

			const salesData = {
				labels: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
				datasets: [
					{
						label: "Sales (₱)",
						data: Array(12).fill(0),
						backgroundColor: "rgba(34,197,94,0.6)",
						borderColor: "rgba(34,197,94,1)",
						borderWidth: 1,
					},
				],
			};

			salesTransactions.forEach((transaction) => {
				const monthIndex = new Date(
					transaction.dataValues.monthStart
				).getMonth();
				if (monthIndex >= 0 && monthIndex < 12) {
					salesData.datasets[0].data[monthIndex] = parseFloat(
						transaction.dataValues.totalSales
					);
				}
			});

			const totalUser = await User.count();
			const pendingRequest = await Request.count({where: {status: "VERIFIED"}});
			const completedRequest = await Request.count({
				where: { status: "COMPLETED" },
			});
			const totalRevenueResult = await Transaction.findOne({
				attributes: [
					[
						sequelize.fn("SUM", sequelize.col("amount")),
						"totalRevenue",
					],
				],
			});
			const totalRevenue =
				totalRevenueResult.dataValues.totalRevenue || 0;

			res.status(200).json({
				success: true,
				message: "Data fetched successfully",
				revenueData,
				salesData,
				totalUser,
				pendingRequest,
				completedRequest,
				totalRevenue,
			});
		} catch (error) {
			console.error("Error fetching admin:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching data",
			});
		}
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
			});

			// console.log(request);
			// return;
			if (!request) {
				return res.status(404).json({
					success: false,
					message: "Request not found",
				});
			}

			const user = await Employee.findOne({
				where: { userId: appointmentData.staffId },
				include: [
					{
						model: User,
						attributes: ["id", "firstname", "lastname", "username"],
					},
				],
			});

			if (!user) {
				return res.status(404).send({
					success: false,
					message: "Employee not found",
				});
			}

			const targetUser = await User.findOne({
				where: { id: request.userId },
			});

			if (!targetUser) {
				return res.status(404).send({
					success: false,
					message: "User not found",
				});
			}

			if (!user.assignedUser.includes(targetUser.id)) {
				await user.update({
					assignedUser: [...user.assignedUser, targetUser.id],
				});
			}

			let chat = await Chat.findOne({
				where: { userId: targetUser.id },
			});

			const welcomeMessage = `Hello, ${targetUser.firstname} ${targetUser.lastname} (${targetUser.username})!\n\nI am ${user.User.firstname} ${user.User.lastname}.\nYou can just call me ${user.User.username}. I will be your chat partner for this request.\n\nFeel free to reach out with any questions about your request!`;

			
			if (!chat) {
				chat = await Chat.create({
					userId: targetUser.id,
					messages: {
						staffadmin: [],
						[`staff${user.User.id}`]: [
							{
								sender: user.User.id,
								text: welcomeMessage,
								replyText: "",
								replyTo: "",
							},
						],
					},
				});
			}

			await request.update({
				isVerified: true,
				assignedEmployee: user.id,
				status: "VERIFIED",
				progress: [
					...(request.progress || []),
					{
						label: "REQUEST VERIFIED",
						details: `Request ${id} has been verified for service "${request.Service.serviceName}" by user ${request.User.firstname} ${request.User.lastname}.`,
					},
				],
			});

			await ActivityLog.create({
				message: `${targetUser.firstname} ${targetUser.lastname} (${targetUser.username}) request has been verified. Assigned to ${user.User.firstname} ${user.User.lastname}`,
			});

			const subject = "Request Verified and Staff Assigned";
			const text = `Your request for the service "${request.Service.serviceName}" has been verified. Staff ${user.User.firstname} ${user.User.lastname} (${user.User.username}) has been assigned to assist you.`;
			const body = `
				<p>Dear ${targetUser.firstname} ${targetUser.lastname},</p>
				<p>Your request for the service <strong>${request.Service.serviceName}</strong> has been successfully verified.</p>
				<p>Staff <strong>${user.User.firstname} ${user.User.lastname}</strong> (username: ${user.User.username}) has been assigned to assist you with this request.</p>
				<p>If you have any questions, feel free to reach out through the chat platform.</p>
				<p>Best regards,<br/>The Team</p>
			`;

			sendEmailToUser(targetUser.email, subject, text, body);

			res.send({
				success: true,
				message:
					"The request is successfully verified. The staff was assigned!",
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

	async viewUserService(req, res) {
		const { userId, staffId } = req.body;

		const whereClause = {};
		if (userId !== undefined && userId !== null)
			whereClause["userId"] = userId;
		if (staffId !== undefined && staffId !== null) {
			const user = await Employee.findOne({
				where: { userId: staffId },
			});
			// console.log(user);
			// console.log(staffId);
			whereClause["assignedEmployee"] = user.id;
		}
		try {
			const request = await Request.findOne({
				where: whereClause,
				include: [
					{
						model: Service,
						attributes: ["serviceName"],
					},
				],
			});
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

	async setAppointment(req, res) {
		const { id, appointmentDate, appointmentNotes } = req.body;
		try {
			const request = await Request.findByPk(id, {
				include: {
					model: Employee,
					include: {
						model: User,
					},
				},
			});
			if (!request) {
				return res.status(404).send({
					success: false,
					message: "Request not found.",
				});
			}
			const user = await User.findByPk(request.userId);
			if (!user) {
				return res.status(404).send({
					success: false,
					message: "User not found.",
				});
			}
			await Appointment.create({
				requestId: id,
				userEmail: user.email,
				staffId: request.Employee.User.id,
				appointmentDate: appointmentDate,
				appointmentNotes: appointmentNotes,
				appointmentPeople:
					request.Employee.User.firstname +
					" " +
					request.Employee.User.lastname,
			});

			await request.update({
				status: "APPOINTED",
			});

			await ActivityLog.create({
				message: `Request ${id} has been marked as appointed. Request has been appointed at ${appointmentDate}.`,
			});
			if (user) {
				const subject = "Your are appointed for Service";
				const text = `Dear ${user.firstname}, your service request has been successfully processed. We appointed you in this date ${appointmentDate}.`;
				const body = `
				<p>Dear ${user.firstname} ${user.lastname},</p>
				<p>We are pleased to inform you that your service request has been successfully processed. We appointed you in this date ${appointmentDate}. Please wait for further notice.</p>
				<p>If you have any further questions or require additional services, feel free to reach out to us.</p>
				<p>Best regards,<br/>The Team</p>
			`;
				sendEmailToUser(user.email, subject, text, body);
			}
			res.send({
				success: true,
				message: "Service request was successfully appointed.",
			});
		} catch (error) {
			console.error("Error appointing request:", error);
			res.send({
				success: false,
				message: `An error occurred while appointing the request. ${error.message}`,
			});
		}
	}

	async completeRequest(req, res) {
		const { id } = req.body;

		try {
			const request = await Request.findByPk(id);

			if (!request) {
				return res.status(404).send({
					success: false,
					message: "Request not found.",
				});
			}

			await request.update({
				status: "COMPLETED",
			});

			await ActivityLog.create({
				message: `Request ${id} has been marked as completed.`,
			});

			const user = await User.findByPk(request.userId);
			if (user) {
				const subject = "Your Service Request is Complete";
				const text = `Dear ${user.firstname}, your service request has been successfully completed.`;
				const body = `
				<p>Dear ${user.firstname} ${user.lastname},</p>
				<p>We are pleased to inform you that your service request has been successfully completed.</p>
				<p>If you have any further questions or require additional services, feel free to reach out to us.</p>
				<p>Best regards,<br/>The Team</p>
			`;

				sendEmailToUser(user.email, subject, text, body);
			}

			res.send({
				success: true,
				message: "Service request was successfully completed.",
			});
		} catch (error) {
			console.error("Error completing request:", error);
			res.send({
				success: false,
				message: `An error occurred while completing the request. ${error.message}`,
			});
		}
	}

	async requestDocument(req, res) {
		const { userId, serviceId, serviceName, imageUrl } = req.body;

		try {
			const service = await Service.findOne({
				where: { id: serviceId },
			});

			if (!service) {
				return res.send({
					success: false,
					message: `Service with ID ${serviceId} not found.`,
				});
			}

			const user = await User.findOne({
				where: { id: userId },
			});

			if (!user) {
				return res.send({
					success: false,
					message: `User with ID ${userId} not found.`,
				});
			}

			const newRequest = await Request.create({
				userId: userId,
				serviceRequestId: serviceId,
				uploadedDocument: imageUrl,
			});

			await Transaction.create({
				userId: userId,
				requestId: newRequest.id,
				typeOfTransaction: "Service Request",
				amount: service.servicePrice,
				uploadedProof: imageUrl,
				referenceNumber: generateReferenceNumber(),
			});

			const subject = "Service Request Confirmation";
			const text = `Your request for the service "${serviceName}" has been successfully submitted.`;
			const body = `
				<p>Dear ${user.name},</p>
				<p>Your request for the service <strong>${serviceName}</strong> has been successfully submitted. Please wait for further notice.</p>
				<p>Below is the document you uploaded:</p>
				<img src="${imageUrl}" alt="Uploaded Document" style="max-width: 100%; height: auto;"/>
				<p>Best regards,<br/>The Team</p>
			`;
			sendEmailToUser(user.email, subject, text, body);

			res.send({
				success: true,
				message: `Service request: "${serviceName}" was sent successfully. Please wait for further notice.`,
			});
		} catch (error) {
			console.error("Error while processing requestDocument:", error);
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error.message}`,
			});
		}
	}

	async uploadImageToCloudinary(req, res) {
		const serviceFile = req.file;

		try {
			const uploadedUrl = await uploadToCloudinary(serviceFile.buffer);
			console.log(uploadedUrl);
			res.send({
				success: true,
				uploadedDocument: uploadedUrl,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error.message}`,
			});
		}
	}

	// add-transaction
	async addToTransaction(req, res) {
		try {
			const {
				userId,
				assignedEmployee,
				requestId,
				typeOfTransaction,
				referenceNumber,
				uploadedProof,
				amount,
				totalPrice,
			} = req.body;

			console.log({
				userId,
				assignedEmployee,
				requestId,
				typeOfTransaction,
				referenceNumber,
				uploadedProof,
				amount,
				totalPrice,
			});

			let transaction = await Transaction.findOne({
				where: { referenceNumber },
			});
			if (transaction) {
				res.send({
					success: false,
					message: `The reference on this transaction is already been used.`,
				});
				return;
			}

			const employee = await Employee.findOne({
				where: { userId: assignedEmployee },
			});
			if (!employee) {
				res.send({
					success: false,
					message: `Employee not found.`,
				});
				return;
			}

			transaction = await Transaction.create({
				userId,
				assignedEmployee: employee.id,
				requestId,
				typeOfTransaction,
				referenceNumber,
				uploadedProof,
				amount,
			});

			const message = `Transaction ${typeOfTransaction} for User ID ${userId} (Ref: ${referenceNumber}) - Amount: ₱${amount}. Assigned to Employee ID: ${
				employee.id
			}. Proof: ${uploadedProof ? "Uploaded" : "Not Uploaded"}`;
			await ActivityLog.create({
				message: message,
			});

			const request = await Request.findByPk(requestId);
			if (!request) {
				res.send({
					success: false,
					message: `Request not found.`,
				});
			}
			await request.update({
				price: parseFloat(totalPrice),
				paidAmount: parseFloat(request.paidAmount) + parseFloat(amount),
				progress: [
					...request.progress,
					typeOfTransaction === "downpayment"
						? {
								label: "ADD DOWN PAYMENT",
								details: `User added a down payment of ₱${amount} for request ${requestId}.`,
						  }
						: parseFloat(request.paidAmount) + parseFloat(amount) >=
						  parseFloat(totalPrice)
						? {
								label: "FULL PAID SERVICE",
								details: `User has fully paid the service with a total of ₱${
									parseFloat(request.paidAmount) +
									parseFloat(amount)
								}.`,
						  }
						: {
								label: "ADD PARTIAL PAYMENT",
								details: `User added a partial payment of ₱${amount} for request ${requestId}.`,
						  },
				],
			});

			res.send({
				success: true,
				data: transaction,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the transaction. ${error.message}`,
			});
			console.log(error.message);
		}
	}

	async addProgressStep(req, res) {
		try {
			const { requestId, step } = req.body;
			const request = await Request.findByPk(requestId);

			if (!request) {
				return res.send({
					success: false,
					message: `Request not found.`,
				});
			}

			await request.update({
				progress: [...request.progress, step],
			});

			await ActivityLog.create({
				message: `Progress step added to request ${requestId}: "${step.label}".`,
			});

			const user = await User.findByPk(request.userId);
			if (user) {
				const subject = "Progress Update for Your Request";
				const text = `A new progress update has been added to your request.`;
				const body = `
				<p>Dear ${user.firstname} ${user.lastname},</p>
				<p>A new progress step has been added to your request:</p>
				<ul>
					<li><strong>Step:</strong> ${step.label}</li>
					<li><strong>Details:</strong> ${step.details}</li>
				</ul>
				<p>Please log in to your account to view the full details.</p>
				<p>Best regards,<br/>The Team</p>
			`;

				sendEmailToUser(user.email, subject, text, body);
			}

			res.send({ success: true });
		} catch (error) {
			console.error("Error adding progress step:", error);
			res.send({
				success: false,
				message: `An error occurred while creating the progress step. ${error.message}`,
			});
		}
	}

	async getAllActivityLog(req, res) {
		try {
			const { currPage, limit } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {};
			const offset = (currPage - 1) * limit;
			const requests = await ActivityLog.findAndCountAll({
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
	// get_all_transaction_user
	async getAllTransactionUser(req, res) {
		try {
			const { id, assignedEmployee, currPage, limit } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {};
			if (id !== undefined && id !== null) {
				whereClause["userId"] = id;
			}
			if (assignedEmployee !== undefined && assignedEmployee !== null) {
				const employee = await Employee.findOne({
					where: { userId: assignedEmployee },
				});
				whereClause["assignedEmployee"] = employee.id;
			}
			const offset = (currPage - 1) * limit;
			const requests = await Transaction.findAndCountAll({
				where: whereClause,
				attributes: { exclude: [] },
				include: [
					{
						model: User,
						attributes: [
							"firstname",
							"lastname",
							"email",
							"profileImg",
							"username",
							"location",
						],
					},
					// {
					// 	model: Employee,
					// 	include: [
					// 		{
					// 			model: User,
					// 			attributes: ["firstname", "lastname"],
					// 		},
					// 	],
					// },
					{
						model: Request,
						attributes: { exclude: [] },
						include: [
							{ model: Service, attributes: ["serviceName"] },
						],
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

	async getAllTransaction(req, res) {
		try {
			const { currPage, limit, isArchived } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {};
			const offset = (currPage - 1) * limit;
			const requests = await Transaction.findAndCountAll({
				where: whereClause,
				attributes: { exclude: [] },
				include: [
					{
						model: User,
						attributes: ["firstname", "lastname", "email"],
					},
					{
						model: Employee,
						include: [
							{
								model: User,
								attributes: ["firstname", "lastname"],
							},
						],
					},
					{
						model: Request,
						attributes: { exclude: [] },
						include: [
							{ model: Service, attributes: ["serviceName"] },
						],
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

	async getAllAssignedUser(req, res) {
		try {
			const { id, currPage, limit } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const employee = await Employee.findOne({ where: { userId: id } });
			if (!employee) {
				return res.status(404).json({
					success: false,
					message: "Employee not found",
				});
			}

			const assignedUserIds = employee.assignedUser || [];
			if (assignedUserIds.length === 0) {
				return res.send({
					success: true,
					data: [],
					total: 0,
					currentPage: currPage,
					totalPages: 0,
				});
			}
			const offset = (currPage - 1) * limit;
			const requests = await Request.findAndCountAll({
				where: {
					userId: {
						[Op.in]: assignedUserIds,
					},
					assignedEmployee: employee.id,
				},
				include: [
					{
						model: User,
						attributes: [
							"id",
							"firstname",
							"lastname",
							"email",
							"profileImg",
							"username",
							"location",
						],
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

	async confirmRequest(req, res) {
		try {
			const { referenceNumber } = req.body;
			const request = await Transaction.findOne({ referenceNumber });
			if (!request) {
				res.send({ success: true, value: false });
			}
			res.send({ success: true, value: true });
		} catch (error) {
			console.error("Error confirming requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while confirming requests",
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

	async getAllOngoingRequest(req, res) {
		try {
			const {
				id,
				assignedEmployee,
				currPage,
				limit,
				status,
				isVerified,
			} = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = { isVerified: true };
			if (assignedEmployee !== undefined && assignedEmployee !== null) {
				const employee = await Employee.findOne({
					where: { userId: assignedEmployee },
				});
				whereClause["assignedEmployee"] = employee.id;
			}

			if (isVerified !== undefined && isVerified !== null)
				whereClause["isVerified"] = isVerified;
			if (id !== undefined && id !== null) whereClause["userId"] = id;
			if (status !== undefined && status !== null)
				whereClause["status"] = status;

			const offset = (currPage - 1) * limit;
			const requests = await Request.findAndCountAll({
				where: whereClause,
				include: [
					{
						model: User,
						attributes: ["id", "firstname", "lastname"],
					},
					{
						model: Employee,
						include: [
							{
								model: User,
								attributes: ["id", "firstname", "lastname"],
							},
						],
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

	async getAllCompletedRequest(req, res) {
		try {
			const { currPage, limit, status } = req.body;

			if (!currPage || !limit) {
				return res.status(400).json({
					success: false,
					message: "Pagination parameters are required",
				});
			}

			const whereClause = {
				isVerified: true,
				status: status,
			};

			const offset = (currPage - 1) * limit;
			const requests = await Request.findAndCountAll({
				where: whereClause,
				include: [
					{
						model: User,
						attributes: ["id", "firstname", "lastname"],
					},
					{
						model: Employee,
						include: [
							{
								model: User,
								attributes: ["id", "firstname", "lastname"],
							},
						],
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
		// express
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/add_employee",
			expressAsyncHandler(this.createEmployee)
		);

		this.router.post("/login", expressAsyncHandler(this.getUser));
		this.router.post("/request", expressAsyncHandler(this.sendRequest));
		this.router.post(
			"/get_request",
			expressAsyncHandler(this.getAllRequest)
		);
		this.router.post(
			"/get_employee",
			expressAsyncHandler(this.getAllEmployee)
		);
		this.router.post(
			"/get_employee_no_page",
			expressAsyncHandler(this.getAllEmployeeNoPage)
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
			"/accept_request_user",
			expressAsyncHandler(this.acceptRequest)
		);
		this.router.post("/get_user", expressAsyncHandler(this.getUserByID));
		this.router.post(
			"/deleteEmployee",
			expressAsyncHandler(this.deleteEmployee)
		);
		this.router.post("/updateProfile", expressAsyncHandler(this.updateProfile));
	}

	async updateProfile(req, res) {
		const {
			id,
			image,
			email,
			username,
			firstname,
			lastname,
			location,
		} = req.body;

		try {
			const user = await User.findByPk(id);
			if (!user) {
				res.send({
					success: false,
					message: `User with ID ${id} not found.`,
				});
				return;
			}

			await user.update({
				profileImg: image,
				email: email,
				username: username,
				firstname: firstname,
				lastname: lastname,
				location: location,
			});
			res.send({
				success: true,
				user
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while updating the user. ${error}`,
			});
		}
	}

	async sendRequest(req, res) {
		const {
			firstName,
			lastName,
			username,
			email,
			password,
			confirmPassword,
		} = req.body;

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
				firstname: firstName,
				lastname: lastName,
				username: username,
				email: email,
				password: await bcrypt.hash(password, 10),
				isVerified: false,
			});

			const subject = "User Registration Request Sent";
			const text = `Dear ${firstName}, your registration request has been received. Please wait for admin approval.`;
			const body = `
				<p>Dear ${firstName},</p>
				<p>Thank you for your registration request. Your request has been received and is currently pending admin approval.</p>
				<p>We will notify you once your request is reviewed.</p>
				<p>Best regards,<br/>The Team</p>
			`;
			sendEmailToUser(email, subject, text, body);
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

		let user = await User.findOne({ where: { email } });
		if (!user) {
			const verifiedUser = await AllUserRequest.findOne({
				where: { email },
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
				firstname: verifiedUser.firstname,
				lastname: verifiedUser.lastname,
				username: verifiedUser.username,
				email: verifiedUser.email,
				password: verifiedUser.password,
			});
			await Chat.create({
				userId: user.id,
				messages: {
					staffadmin: [],
				},
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

	async createEmployee(req, res) {
		const { firstname, lastname, username, email, password, location } =
			req.body;

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



		let user = await AllUserRequest.findOne({
			where: { email },
		});
		if (user) {
			res.send({
				success: false,
				message: `User email already being used.`,
			});
			return;
		}

		user = await User.findOne({where: {email}});
		if (user) {
			res.send({
				success: false,
				message: `User email already being used.`,
			});
			return;
		}

		user = await User.create({
			firstname: firstname,
			lastname: lastname,
			username: username,
			email: email,
			location: location,
			password: await bcrypt.hash(password, 10),
			isEmployee: true,
		});

		await Employee.create({ userId: user.id });
		await Chat.create({
			userId: user.id,
			messages: {
				staffadmin: [],
			},
		});
		return res.send({
			success: true,
			message: "Successfully created an employee!",
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

			await request.update({
				isVerified: true,
			});

			await ActivityLog.create({
				message: `Account request for ${request.firstname} ${request.lastname} (${request.username}) has been verified.`,
			});

			const subject = "Account Request Verified";
			const text = `Dear ${request.firstname}, your account request has been verified. You can now log in to complete your registration.`;
			const body = `
				<p>Dear ${request.firstname},</p>
				<p>We are pleased to inform you that your account request has been verified. You can now log in to our platform to complete your registration process and start using our services.</p>
				<p>If you encounter any issues, feel free to reach out to our support team.</p>
				<p>Best regards,<br/>The Team</p>
			`;
			sendEmailToUser(request.email, subject, text, body);
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
				where: { isEmployee: false },
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

	async getAllEmployee(req, res) {
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
				where: {
					isEmployee: true,
				},
				include: [
					{
						model: Employee,
						attributes: [
							"assignedUser",
							"description",
							"numberHandledUser",
						],
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

	async deleteEmployee(req, res) {
		try {
			const { id } = req.body;

			const user = await User.findOne({
				where: { id },
			});

			if (!user) {
				return res.send({
					success: false,
					message: "This user does not exists",
				});
			}
			await user.destroy();
			res.send({
				success: true,
			});
		} catch (error) {
			console.error("Error fetching account requests:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching requests",
			});
		}
	}

	async getAllEmployeeNoPage(req, res) {
		try {
			const employee = await User.findAll({
				where: {
					isEmployee: true,
				},
				include: [
					{
						model: Employee,
						attributes: [
							"assignedUser",
							"description",
							"numberHandledUser",
						],
					},
				],
			});
			res.json({
				success: true,
				data: employee,
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
// const multer = require("multer");

// const { v2: cloudinary } = require("cloudinary");

// cloudinary.config({
// 	cloud_name: "djheiqm47",
// 	api_key: "692765673474153",
// 	api_secret: "kT7k8hvxo-bqMWL0aHB2o3k90dA",
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// async function uploadToCloudinary(buffer) {
// 	return new Promise((resolve, reject) => {
// 		cloudinary.uploader
// 			.upload_stream({ resource_type: "auto" }, (error, result) => {
// 				if (error) reject(error);
// 				else resolve(result.secure_url);
// 			})
// 			.end(buffer);
// 	});
// }

class ImageHandler {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/upload-image",
			upload.single("file"),
			expressAsyncHandler(this.uploadImageToCloudinary)
		);
	}

	async uploadImageToCloudinary(req, res) {
		const serviceFile = req.file;

		try {
			const uploadedUrl = await uploadToCloudinary(serviceFile.buffer);
			res.send({
				success: true,
				uploadedDocument: uploadedUrl,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error.message}`,
			});
		}
	}
}

const imageRouter = new ImageHandler().router;

const userRouter = new UserRouter().router;
const chatRouter = new ChatRouter().router;
const reqRouter = new RequestRouter().router;
const servRouter = new ServiceRouter().router;
const appointmentRouter = new AppointmentRouter().router;
module.exports = {
	imageRouter,
	userRouter,
	chatRouter,
	reqRouter,
	servRouter,
	appointmentRouter,
	sequelize,
};
