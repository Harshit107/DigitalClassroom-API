const mongoose = require('mongoose')
const Class = require('../model/Class')
const User = require('../model/User')
const express = require('express')
const router = new express.Router();
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const sendEmail = require('../email/sendMail')
const fetch = require("node-fetch");




router.post('/class/mail/send', auth, async (req, res) => {


    try {

        const classId = req.body.classId;

        const classUser = await Class.findById(classId)
        if (!classUser)
            return res.status(404).send({
                error: "no class found"
            })

        const alluserId = classUser.users

        const findEmail = async (alluserId) => {
            var userMail = [];
            for (let i = 0; i < alluserId.length; i++) {
                let userDetail = await User.findById(alluserId[i].member)
                userMail.push(userDetail.email)
            }
            return userMail
        }
        const allEmailId = await findEmail(alluserId);

        //----------------------------------------------------------------


        const preHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Post</title>
    </head>
    <body style=" width : 100%;">
    <div style="margin-top: 100px;">
        <div  style=" max-width: 90%; margin: 0 auto;">
            <div style="background:blue; padding: 20px 0px; ">
                <div style="text-align: center;">
                    <img src="https://www.digitalclassroom.ml/assets/favicon-light.png" width="60px">
                    <p style=" margin:0;padding-top: 10px;font-size: 20px;color : white;">Digital-Classroom</p>
                </div>
            </div>
            <div  style="padding : 10px 20px; border : 2px solid  rgb(34, 74, 133);border-top: 10px solid rgb(34, 74, 133); background-color : white;">
                <div class="into">
                    <h3>Hi Everyone,</h3>
                    <p> ${req.user.name} posted a new ${req.body.type || 'post'} in <span class="classname" style="color : blue; font-size :18px;"> ${classUser.className}</span> </p>
                </div>

                <div class="message-body"style=" display: flex;align-items :center; padding : 10px; text-align: center;">
                    <img src=${req.user.image || "https://www.searchpng.com/wp-content/uploads/2019/02/Samsung-Message-icon-1024x941.png"} width="60px" height =" 60px" style ="border-radius: 50%; margin-right: 20px;"                            >
                    <div class="message-body__containt" style="flex-grow: 1;">
                        <p style = "padding : 5px 0;margin : 0 0 10px 0;">${req.body.message}</p>
                        <a style ="background : blue;color :white;padding : 5px 15px;cursor: pointer;text-decoration: none;" href=${req.body.link || "https://digitalclassroom.ml"}>Open App</a>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </body>
    </html>`
      


        //----------------------------------------------------------------


        await sendEmail(allEmailId,req.body.message, preHtml)
        // console.log(allEmailId)

        res.status(200).send({
            message: "Success",
            senderName : req.user.name
        })


    } catch (error) {
        console.log({
            error
        })
        res.status(404).send({
            error
        })
    }

})


router.post('/class/send/notification/send',auth ,async (req, res) => {


    try {
    // console.log('object :>> ', "Hi");
    const classId = req.body.classId;
    const fcmUrl = 'https://fcm.googleapis.com/fcm/send'
    const classUser = await Class.findById(classId)

    if (!classUser)
        return res.status(404).send({
            error: "no class found"
        })

    const alluserId = classUser.users

    const findToken = async (alluserId) => {

        var userToken = [];

        for (let i = 0; i < alluserId.length; i++) {
            let userDetail = await User.findById(alluserId[i].member)
            if(userDetail.deviceToken)
                userToken.push(userDetail.deviceToken)

        }
        return userToken

    }
    const allToken = await findToken(alluserId);
    // console.log(allToken)
    
    let body = {
        to : allToken[0],
        notification : {
            title : req.body.title,
            body : req.body.body,
            image : req.body.image,
            color : "#434761"
        },
        data : {

        }
      };
      
      let response = await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "key=AAAAh1DzL1M:APA91bH1ZsoPLM4DGxSwdj4dvNQlrW2l-DIU4P9CT1NtD_7CyeeaT2h3T0I8ktC_WUxl6rgqqRX92p2hX-z25QrCD7uf9Ue4ij0jgLb5_Hy1ZCFZkOrQMhetsEN6Cwq32L_-47HVwm2j" 
        },
        body: JSON.stringify(body)
      });
      
      let result = await response.json();
    //   console.log(result)
      res.status(200).send(result)

    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }

})


router.post('/class/send/notification/topic/send',auth ,async (req, res) => {

    try {
    const classId = req.body.classId;
    const fcmUrl = 'https://fcm.googleapis.com/fcm/send'
    const classUser = await Class.findById(classId)

    if (!classUser)
        return res.status(404).send({
            error: "No class found"
        })

    
    let body = {
        to : `/topics/${classId}`,
        notification : {
            title : req.body.title,
            body : req.body.body,
            image : req.body.image,
            color : "#434761"
        },
        data : {
            link : req.body.link
        }
      };
      
      let response = await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "key=AAAAh1DzL1M:APA91bH1ZsoPLM4DGxSwdj4dvNQlrW2l-DIU4P9CT1NtD_7CyeeaT2h3T0I8ktC_WUxl6rgqqRX92p2hX-z25QrCD7uf9Ue4ij0jgLb5_Hy1ZCFZkOrQMhetsEN6Cwq32L_-47HVwm2j" 
        },
        body: JSON.stringify(body)
      });
      
      let result = await response.json();
      console.log(result)
      res.status(200).send(result)

    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }

})


module.exports = router