"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'


const sendMail = async function (email, message, preHtml) {

    // const fromEmail ='harshit@digitalclassroom.online';
    // const password = 'dword:00000000';
    
    const fromEmail =process.env.EMAIL;
    const password = process.env.PASSWORD;
    

    message = message || 'You have new Post from Digital Classroom'
    
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
        subject: `${appname}`,
        text: `${message}`,
        html: preHtml
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs'+err);
        } else {
            console.log('Email sent successfully');
        }
    });
}
module.exports = sendMail