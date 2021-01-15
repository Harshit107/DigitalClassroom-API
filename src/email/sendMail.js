"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async function (email, message, preHtml) {

    const fromEmail =process.env.SENDINBLUE_EMAIL;
    const password = process.env.SENDINBLUE_PASSWORD;
 
    
    message = message || 'You have new Post from Digital Classroom'
    let mailTransporter = nodemailer.createTransport({ 
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: { 
            user: fromEmail, 
            pass: password
        } 
    }); 
      

    let mailDetails = {
        from: "digitalclassroom@imharshit.tech",
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

    // const msg = {
    //     to: email, // Change to your recipient
    //     from: 'digitalclassroom@harshit-keshari.tech', // Change to your verified sender
    //     subject: `${appname}`,
    //     text: message,
    //     html: preHtml,
    //   }

    // sgMail.send(msg) .then(() => {
    //     console.log('Email sent')
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })


}
module.exports = sendMail