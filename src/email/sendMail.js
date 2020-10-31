"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'


const sendMail = async function (email) {

    const fromEmail = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const message = 'You Have new Post from Digital Classroom'
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
        text: `${message}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}
module.exports = sendMail