"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()
const appname = 'DigitalClassroom'
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendMail = async function(email,_id="",preHtml){

    const fromEmail =process.env.SENDINBLUE_EMAIL;
    const password = process.env.SENDINBLUE_PASSWORD;

    var url = 'https://digitalclassroom.herokuapp.com/verify/email/'
    
    const message = `Hi, Only verified accout have access to use DigitalClassroom feature\n Click the link below to verify your email address\n\n${url+_id}`
       const html =  preHtml ||  `<!DOCTYPE html>
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
    
        let mailTransporter = nodemailer.createTransport({ 
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            auth: { 
                user: fromEmail, 
                pass: password
            } 
        }); 
          
    
    const msg = {
        to: email, // Change to your recipient
        from: 'digitalclassroom@imharshit.tech', // Change to your verified sender
        subject: `Verify Your Email for ${appname}`,
        text:  message,
        html: html,
    }
    
      mailTransporter.sendMail(msg, function (err, data) {
        if (err) {
            console.log('Error Occurs'+err);
        } else {
            console.log('Email sent successfully');
        }
    });
    // sgMail.send(msg).then(() => {
    //     console.log('Email sent')
    //     })
    //   .catch((error) => {
    //     console.error(error)
    // })
   
}
module.exports = sendMail


