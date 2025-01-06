const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = [];
		const password = "123";
		const hashedPassword = await bcrypt.hash(password, 10);

		for (let i = 0; i < 10; i++) {
			users.push({
				profileImg: faker.image.avatar(), // Use image.avatar to generate a random avatar image URL
				username: faker.internet.username(),
				firstname: faker.person.firstName(),
				lastname: faker.person.lastName(),
				email: faker.internet.email(),
				password: hashedPassword, // store the hashed password
				location: faker.location.city(),
				isAdmin: false,
				isEmployee: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		users.push({
			profileImg: faker.image.avatar(), // Use image.avatar to generate a random avatar image URL
			username: faker.internet.username(),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			email: "jdmaster888@gmail.com",
			password: hashedPassword,
			location: faker.location.city(),
			isAdmin: false,
			isEmployee: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// users.push({
		// 	profileImg: faker.image.avatar(), // Use image.avatar to generate a random avatar image URL
		// 	username: faker.internet.username(),
		// 	firstname: faker.person.firstName(),
		// 	lastname: faker.person.lastName(),
		// 	email: "test@gmail.com",
		// 	password: hashedPassword,
		// 	location: faker.location.city(),
		// 	isAdmin: false,
		// 	isEmployee: true,
		// 	createdAt: new Date(),
		// 	updatedAt: new Date(),
		// });

		await queryInterface.bulkInsert("Users", users);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
