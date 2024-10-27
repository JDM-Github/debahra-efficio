require("dotenv").config();
const pg = require("pg");
const {
	Sequelize,
	DataTypes,
	BOOLEAN,
	STRING,
	DATE,
	DECIMAL,
	Transaction,
} = require("sequelize");

const sequelize = new Sequelize(
	"postgresql://efficio:qH53-TmtuwcH5M6q2PcoMA@efficio-database-2274.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/efficio?sslmode=verify-full",
	{
		dialect: "postgres",
		dialectModule: pg,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
);

// User:
// 	id INT
// 	username STRING
// 	firstname STRING
// 	lastname STRING
// 	email STRING
// 	password STRING
// 	location STRING
// 	membership STRING
// 	membershipExpire DATE;
// 	isAdmin BOOLEAN
// 	createdAt DATE
// 	updatedAt DATE

// MembershipTransaction:
// 	id INT
// 	membershipType STRING
// 	price DECIMAL
// 	createdAt DATE
// 	updatedAt DATE

// AllUserRequest:
// 	id INT
// 	userId INT
// 	password STRING
// 	isVerified BOOLEAN
// 	createdAt DATE
// 	updatedAt DATE

// Service:
// 	id INT
// 	serviceName STRING
// 	serviceForm JSON
// 	servicePrice DECIMAL // di sure toh kase sabe membership
// 	createdAt DATE
// 	updatedAt DATE

// Request:
// 	id INT
// 	userId INT
// 	serviceId INT
// 	status STRING
// 	isArchived BOOLEAN
// 	createdAt DATE
// 	updatedAt DATE

// Appointment:
// 	id INT
// 	requestId INT
// 	appointmentDate DATE
// 	status STRING
// 	createdAt DATE
// 	updatedAt DATE

// Notification:
// 	id INT
// 	userId INT
// 	message STRING
// 	notificationType STRING
// 	createdAt DATE
// 	updatedAt DATE

// Chat:
// 	id INT
// 	userId INT
// 	messages JSON
// 	createdAt DATE
// 	updatedAt DATE

// Transaction:
// 	id INT
// 	requestId STRING
// 	createdAt DATE
// 	updatedAt DATE

const Chat = sequelize.define(
	"Chat",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			references: {
				model: "Users",
				key: "id",
			},
		},
		messages: {
			type: DataTypes.JSONB,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

const User = sequelize.define(
	"User",
	{
		profileImg: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
		},
		username: { type: DataTypes.STRING, allowNull: false },
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },

		location: { type: DataTypes.STRING, defaultValue: "" },
		membership: { type: DataTypes.STRING, defaultValue: "MEMBER" },
		membershipExpire: { type: DataTypes.DATE, defaultValue: null },

		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

const AllUserRequest = sequelize.define("VerifiedUser", {
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
	isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
	isArchived: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Service = sequelize.define(
	"Service",
	{
		serviceName: { type: DataTypes.STRING, allowNull: false },
		serviceImg: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		serviceURL: { type: DataTypes.STRING, allowNull: false },
		serviceDescription: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
	},
	{
		timestamps: true,
	}
);

const Request = sequelize.define(
	"Request",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			references: {
				model: "Users",
				key: "id",
			},
		},
		serviceRequestId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Services",
				key: "id",
			},
		},
		serviceForm: {
			type: DataTypes.JSONB,
			allowNull: null,
			defaultValue: {},
		},
		uploadedDocument: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
		},

		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "ONGOING",
		},
		isArchived: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		timestamps: true,
	}
);

const Appointment = sequelize.define(
	"Appointment",
	{
		requestId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			references: {
				model: "Requests",
				key: "id",
			},
		},
		appointmentDate: { type: DataTypes.DATE, allowNull: false },
		appointmentPeople: { type: DataTypes.STRING, defaultValue: "" },
		appointmentNotes: { type: DataTypes.STRING, defaultValue: "" },
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "ONGOING",
		},
	},
	{
		timestamps: true,
	}
);

// const Notification = sequelize.define(
// 	"Notification",
// 	{
// 		userId: {
// 			type: DataTypes.INTEGER,
// 			allowNull: false,
// 			unique: true,
// 			references: {
// 				model: "Users",
// 				key: "id",
// 			},
// 		},
// 		messages: { type: DataTypes.STRING, allowNull: false },
// 		notificationType: { type: DataTypes.STRING, allowNull: false },
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

User.hasMany(Chat, { foreignKey: "userId" });
Chat.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Request, { foreignKey: "userId" });
Request.belongsTo(User, { foreignKey: "userId" });

Service.hasMany(Request, { foreignKey: "serviceRequestId" });
Request.belongsTo(Service, { foreignKey: "serviceRequestId" });

Request.hasMany(Appointment, { foreignKey: "requestId" });
Appointment.belongsTo(Request, { foreignKey: "requestId" });

module.exports = {
	Chat,
	User,
	AllUserRequest,
	Service,
	Request,
	Appointment,
	sequelize,
};
