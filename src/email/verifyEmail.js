"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'


const sendMail = async function(email,_id=""){

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
    text: `Verify your mail \n${url+_id}`,
    html : `<!DOCTYPE html>
            <html lang="en">
            <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        </head>
        <body style=" color: black; text-align: center ">
        
        <div style="margin-top: 100px;">
            <img src="https://harshit-keshari.tk/img/rmail-logo.png"
             style="width: 100px; height: 100px; margin-top : 20px" >
             <p style="font-size: 28px;">Verify your email</p>
             <p style="font-size: 18px;">Hi, Only verified accout have access to use DigitalClassroom feature\n
             click the button below to verify your email address.</p>
             <a href=${url+_id} style=" text-decoration: none; color: white; font-size : 20px; padding: 7px 20px; background-color: #75c0f1;">Verify Now</a>
             <p>OR\nVerify through link\n${url+_id} </p>    
        </div>
        </body>
        </html>`

}; 
  
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs : '+err); 
    } else { 
        console.log('Email sent successfully'); 
    } 
}); 
}
module.exports = sendMail