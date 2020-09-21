"use strict";
const nodemailer = require("nodemailer");

async function verifyEamil(emailArray,_id) {

	var url = 'http://localhost:3000/verify/email/'

	const smtpEndpoint = "email-smtp.us-west-2.amazonaws.com";
	const port = 587;
	const senderAddress = "StudyFy <contact@harshit-keshari.tech>";
	var toAddresses = emailArray;

	var ccAddresses = "cc-recipient0@example.com,cc-recipient1@example.com";
	var bccAddresses = "bcc-recipient@example.com";
	var subject = "Verify your Email";
	var body_text = `Thank you for choosing StydyFy.\nPlease verify your Email-Address\n
					${url}${_id}`;
	var body_html = `<html>
<head></head>
<body>
  <h1>Amazon SES Test (Nodemailer)</h1>
  <p>This email was sent with <a href='https://aws.amazon.com/ses/'>Amazon SES</a>
        using <a href='https://nodemailer.com'>Nodemailer</a> for Node.js.</p>
</body>
</html>`;
	var tag0 = "key0=value0";
	var tag1 = "key1=value1";

	let transporter = nodemailer.createTransport({
		host: smtpEndpoint,
		port: port,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD
		}
	});

	// Specify the fields in the email.
	let mailOptions = {
		from: senderAddress,
		to: toAddresses,
		subject: subject,

		text: body_text,
		// html: body_html,
		// Custom headers for configuration set and message tags.
		headers: {
			'X-SES-MESSAGE-TAGS': tag0,
			'X-SES-MESSAGE-TAGS': tag1
		}
	};

	// Send the email.
	let info = await transporter.sendMail(mailOptions)

	console.log("Message sent! Message ID: ", info.messageId);
}


const sendMail = ( emailArray,_id ) => {
	verifyEamil(emailArray,_id).catch(console.error);
}
module.exports = sendMail