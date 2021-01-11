"use strict";
// const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async function (email, message, preHtml) {


    // const fromEmail =process.env.EMAIL;
    // const password = process.env.PASSWORD;
    

    message = message || 'You have new Post from Digital Classroom'
    
    // let mailTransporter = nodemailer.createTransport({ 
    //     service: 'gmail', 
    //     auth: { 
    //         user: fromEmail, 
    //         pass: password
    //     } 
    // }); 
      

    // let mailDetails = {
    //     from: fromEmail,
    //     to: email,
    //     subject: `${appname}`,
    //     text: `${message}`,
    //     html: preHtml
    // };

    // mailTransporter.sendMail(mailDetails, function (err, data) {
    //     if (err) {
    //         console.log('Error Occurs'+err);
    //     } else {
    //         console.log('Email sent successfully');
    //     }
    // });

    const msg = {
        to: email, // Change to your recipient
        from: 'digitalclassroom@harshit-keshari.tech', // Change to your verified sender
        subject: `${appname}`,
        text: message,
        html: preHtml,
      }

    sgMail.send(msg) .then(() => {
        console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })


}
module.exports = sendMail