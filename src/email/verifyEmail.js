"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'


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