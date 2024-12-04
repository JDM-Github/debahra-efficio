require("dotenv").config();
const pg = require("pg");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
	"postgresql://jdm:gA00MXJG6XdxLl7tZvCuEA@jdm-master-15017.7tt.aws-us-east-1.cockroachlabs.cloud:26257/efficio?sslmode=verify-full",
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
		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		isEmployee: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		transaction_id: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
	},
	{
		timestamps: true,
	}
);

const Employee = sequelize.define("Employee", {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
		references: {
			model: "Users",
			key: "id",
		},
	},
	assignedUser: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		allowNull: true,
		defaultValue: [],
	},
	description: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
	numberHandledUser: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
});

const AllUserRequest = sequelize.define("VerifiedUser", {
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
		servicePrice: {
			type: DataTypes.INTEGER,
			defaultValue: 100,
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
		assignedEmployee: {
			type: DataTypes.INTEGER,
			allowNull: true,
			unique: true,
			references: {
				model: "Employees",
				key: "id",
			},
		},
		progress: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: null,
			defaultValue: [],
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "ONGOING",
		},
		price: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: null,
		},
		paidAmount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: null,
		},
		isArchived: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		cancelledAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			allowNull: true,
		},
		completedAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			allowNull: true,
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

const Transaction = sequelize.define(
	"Transaction",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		assignedEmployee: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "Employees",
				key: "id",
			},
		},
		requestId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Requests",
				key: "id",
			},
		},
		typeOfTransaction: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		uploadedProof: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		referenceNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

const ActivityLog = sequelize.define(
	"ActivityLog",
	{
		message: { type: DataTypes.STRING, allowNull: false },
	},
	{
		timestamps: true,
	}
);

const Notification = sequelize.define(
	"Notification",
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
		messages: { type: DataTypes.STRING, allowNull: false },
		notificationType: { type: DataTypes.STRING, allowNull: false },
	},
	{
		timestamps: true,
	}
);

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Employee, { foreignKey: "userId" });
Employee.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Chat, { foreignKey: "userId" });
Chat.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Request, { foreignKey: "userId" });
Request.belongsTo(User, { foreignKey: "userId" });

Service.hasMany(Request, { foreignKey: "serviceRequestId" });
Request.belongsTo(Service, { foreignKey: "serviceRequestId" });

Employee.hasMany(Request, { foreignKey: "assignedEmployee" });
Request.belongsTo(Employee, { foreignKey: "assignedEmployee" });

Request.hasMany(Appointment, { foreignKey: "requestId" });
Appointment.belongsTo(Request, { foreignKey: "requestId" });

User.hasMany(Transaction, {
	foreignKey: "userId",
});
Transaction.belongsTo(User, {
	foreignKey: "userId",
});

Employee.hasMany(Transaction, {
	foreignKey: "assignedEmployee",
});
Transaction.belongsTo(Employee, {
	foreignKey: "assignedEmployee",
});

Request.hasMany(Transaction, {
	foreignKey: "requestId",
});
Transaction.belongsTo(Request, {
	foreignKey: "requestId",
});

module.exports = {
	Chat,
	User,
	AllUserRequest,
	Service,
	Request,
	Appointment,
	Employee,
	Transaction,
	ActivityLog,
	sequelize,
};
