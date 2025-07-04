// const nodemailer = require("nodemailer");

// // You can use this for your website, Makes authentication possible.
// // You just need to think how you use this. This is same for the sms authentication
// let transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		user: "efficiodebahra@gmail.com",
// 		pass: "zlcm esux xmyq lndm", // Generated password from Google.
// 	},
// });

// /**
//  * Function to send an email
//  * @param {string} to - The recipient email address
//  * @param {string} subject - The subject of the email
//  * @param {string} text - The plain text content of the email
//  * @param {string} html - The HTML content of the email
//  * @param {function} callback - Callback function to handle success or error
//  */
// function sendEmail(to, subject, text, html, callback) {
// 	const mailOptions = {
// 		from: "efficiodebahra@gmail.com",
// 		to: to,
// 		subject: subject,
// 		text: text,
// 		html: html,
// 	};

// 	transporter.sendMail(mailOptions, (error, info) => {
// 		if (error) {
// 			return callback(error, null);
// 		}
// 		callback(null, `Message sent: ${info.messageId}`);
// 	});
// }

// module.exports = sendEmail;


async function sendEmail(to, subject, text, html) {
	const { SMTPClient } = await import("emailjs");

	const client = new SMTPClient({
		user: "efficiodebahra@gmail.com",
		password: "zlcm esux xmyq lndm",
		host: "smtp.gmail.com",
		ssl: true,
	});

	return new Promise((resolve, reject) => {
		client.send(
			{
				text: text,
				from: "efficiodebahra@gmail.com",
				to: to,
				subject: subject,
				attachment: [{ data: html, alternative: true }],
			},
			(err, message) => {
				if (err) {
					reject(err);
				} else {
					resolve(message);
				}
			}
		);
	});
}