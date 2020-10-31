const express = require('express')
const router = new express.Router()
const Class = require('../model/Class')
const Stream = require('../model/Stream')
const Chat = require('../model/Chat')
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const User = require('../model/User.js')
const mongoose = require('../db/mongoose')

router.post("/class/stream/create",auth ,async( req, res) => {


    try {

        req.body.createdBy = req.user.name;
        req.body.createrId = req.user._id;
        req.body.createrImage = req.user.image == undefined  ? "default" : req.user.image  ;
        const stream = await new Stream(req.body)
        await stream.save();
        res.status(200).send(stream)
        
    } catch (error) {
        console.log(error)
        response.status(404).send(error)
    }
   

})


router.post("/class/stream/read",auth ,async( req, res) => {


    try {
        const classId = req.header('classId');
        const myClass = await Class.findById(classId)
        await myClass.populate({
            path : "streamData"
        }).execPopulate();
        
        res.status(200).send(myClass.streamData)
        
    } catch (error) {
        console.log(error)
        response.status(404).send(error)
    }
})

//read specific post
router.post("/class/stream/read/detail", auth, async(req,res)=> {

    try {
        
        const uniqueId = req.body.uniqueId;
        const streamData = await Stream.findById(uniqueId)
        if(!streamData)
            return res.status(404).send({error: "post not found"})
    
        res.status(200).send(streamData);

    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }

    

})

//real all the post of the class
router.post("/class/stream/chat/read",auth ,async( req, res) => {


    try {
        const classId = req.body.classId;
        const uniqueId = req.body.uniqueId;
        const message = await Chat.find({
            classId,
            uniqueId
        })
        res.status(200).send({
            message
        })
        
    } catch (error) {
        console.log(error)
        response.status(404).send({error})
    }
})
//delete post 
router.post("/class/stream/delete",auth ,async( req, res) => {

    try {
        const classId = req.body.classId;
        const _id = req.body.id;
        console.log(req.body)
        const streamPost = await Stream.findOneAndDelete({
            classId,
            _id
        })
        if(!streamPost)
            return res.status(404).send({error:"Post not found"})


        res.status(200).send({
            message : "Success"
        })
        
    } catch (error) {
        console.log(error)
        response.status(404).send({error})
    }
})

//chat reply
router.post("/class/stream/chat/reply",auth ,async( req, res) => {

    try {
        const classId = req.body.classId;
        const uniqueId = req.body.uniqueId;
        const message = req.body.message;
        const date = req.body.date;
        const senderImage = req.user.image == undefined  ? "default" : req.user.image ;


        const reply = new Chat({
            classId,
            uniqueId,
            message,
            senderName : req.user.name,
            senderId : req.user._id,
            senderImage,
            date

        })

        await reply.save()
        // console.log(reply)
        res.status(200).send({
            reply
        })
    } catch (error) {
        console.log(error)
        response.status(404).send({error})
    }
})




module.exports = router
