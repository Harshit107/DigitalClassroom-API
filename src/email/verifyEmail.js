"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
var smtpTransport = require('nodemailer-smtp-transport');
const appname = 'DigitalClassroom'

// async function verifyEamil(emailArray,_id) {
// 	// var url = 'http://localhost:3000/verify/email/'
// 	var url = 'https://digitalclassroom.herokuapp.com/verify/email/'

// 	//const smtpEndpoint = "email-smtp.us-west-2.amazonaws.com";
// 	 const smtpEndpoint = "smtp.gmail.com";
// 	const port = 587;
// 	const senderAddress = "DigitalClassroom <harshitkeshari199@gmail.com>";
// 	var toAddresses = emailArray;

// 	var ccAddresses = "cc-recipient0@example.com,cc-recipient1@example.com";
// 	var bccAddresses = "bcc-recipient@example.com";
// 	var subject = "Verify your Email";
// 	var body_text = `Thank you for choosing ${appname}.\nPlease verify your Email-Address\n${url}${_id}`;
// 	var body_html = `<html>
// <head></head>
// <body>
//   <h1>Amazon SES Test (Nodemailer)</h1>
//   <p>This email was sent with <a href=${url}${_id}>Amazon SES</a>
//         using <a href='https://nodemailer.com'>Nodemailer</a> for Node.js.</p>
// </body>
// </html>`;
// 	var tag0 = "key0=value0";
// 	var tag1 = "key1=value1";

// 	let transporter = nodemailer.createTransport({
// 		service : 'gmail',
// 		host: smtpEndpoint,
// 		port: port,
// 		secure: false, // true for 465, false for other ports
// 		auth: {
// 			user: process.env.USERNAME,
// 			pass: process.env.PASSWORD
// 		}
// 	});

// 	// Specify the fields in the email.
// 	let mailOptions = {
// 		from: senderAddress,
// 		to: toAddresses,
// 		subject: subject,

// 		text: body_text,
// 	//	 html: body_html,
// 		// Custom headers for configuration set and message tags.
// 		headers: {
// 			'X-SES-MESSAGE-TAGS': tag0,
// 			'X-SES-MESSAGE-TAGS': tag1
// 		}
// 	};

// 	// Send the email.
// 	let info = await transporter.sendMail(mailOptions)

// 	console.log("Message sent! Message ID: ", info.messageId);
// }


// const sendMail = ( emailArray,_id ) => {
// 	verifyEamil(emailArray,_id).catch(console.error);
// }

const sendMail = async function(email,_id){

	const fromEmail = process.env.EMAIL;
	const password = process.env.PASSWORD;
	// var url = 'http://localhost:3000/verify/email/'
	var url = 'https://digitalclassroom.herokuapp.com/verify/email/'

let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: fromEmail, 
        pass: password
    } 
}); 
  
let mailDetails = { 
    from: fromEmail, 
    to: email, 
    subject: `Email Verification`, 
    text: `Verify your mail \n${url+_id}`
}; 
  
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
}); 
}
module.exports = sendMail