const express = require('express')
const router = new express.Router()
const Class = require('../model/Class')
const Assignment = require('../model/Assignment')
const AssignmentSubmit = require('../model/AssignmentSubmit')
const Chat = require('../model/Chat')
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const User = require('../model/User.js')
const mongoose = require('../db/mongoose')


// Stream
router.post("/class/assignment/create", auth, async (req, res) => {


    try {

        req.body.createdBy = req.user.name;
        req.body.createrId = req.user._id;
        req.body.createrImage = req.user.image == undefined ? "default" : req.user.image;
        const assignment = await new Assignment(req.body)
        await assignment.save();
        res.status(200).send(assignment)

    } catch (error) {
        console.log(error)
        response.status(404).send(error)
    }


})


router.post("/class/assignment/read", auth, async (req, res) => {


    try {
        const classId = req.header('classId');
        const myClass = await Class.findById(classId)
        await myClass.populate({
            path: "assignmentData"
        }).execPopulate();

        res.status(200).send(myClass.assignmentData)

    } catch (error) {
        console.log(error)
        response.status(404).send(error)
    }
})


//real all the post of the class
router.post("/class/assignment/chat/read", auth, async (req, res) => {


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
        response.status(404).send({
            error
        })
    }
})
//delete post 

router.post("/class/assignment/delete", auth, async (req, res) => {

    try {
        const classId = req.body.classId;
        const _id = req.body.id;
        console.log(req.body)
        const assignmentPost = await Assignment.findOneAndDelete({
            classId,
            _id
        })
        if (!assignmentPost)
            return res.status(404).send({
                error: "Post not found"
            })


        res.status(200).send({
            message: "Success"
        })

    } catch (error) {
        console.log(error)
        response.status(404).send({
            error
        })
    }
})

//chat reply
router.post("/class/assignment/chat/reply", auth, async (req, res) => {

    try {
        const classId = req.body.classId;
        const uniqueId = req.body.uniqueId;
        const message = req.body.message;
        const date = req.body.date;
        const senderImage = req.user.image == undefined ? "default" : req.user.image;


        const reply = new Chat({
            classId,
            uniqueId,
            message,
            senderName: req.user.name,
            senderId: req.user._id,
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
        response.status(404).send({
            error
        })
    }
})



//***     Student assignment submission      **** */


//submit assignment
router.post('/class/assignment/student/submit', auth, async (req, res) => {


    try {

        const {
            name,
            image,
            enroll,
            _id
        } = req.user
        req.body.name = name;
        req.body.id = _id;
        req.body.enroll = enroll;
        req.body.image = image;

        const assignmentSubmit = new AssignmentSubmit(req.body)
        const result = await assignmentSubmit.save();
        // console.log(result)

        res.status(200).send(result)

    } catch (error) {
        console.log({
            error
        })
        res.status(400).send({
            error
        })
    }



})

//read specific post
router.post("/class/assignment/read/detail", auth, async (req, res) => {

    try {

        const uniqueId = req.body.uniqueId;
        let assignmentData = await Assignment.findById(uniqueId)
        if (!assignmentData)
            return res.status(404).send({
                error: "post not found"
            })

        const classId = assignmentData.classId
        const getClass = await Class.findOne({
            _id: classId,
            'admins.admin': req.user._id
        })

        //checking if admin
        let submission = {
            admin: false,
            submitted: false
        }

        if (getClass)
            submission.admin = true

        //if student checking assignment submitted or not
        const id = req.user._id
        const assignmentSub = await AssignmentSubmit.find({
            uniqueId,
            classId,
            id
        })
        if (assignmentSub.length >0 ){
            submission.submitted = true
            submission.submittedFile = assignmentSub[0].file
            
        }
            
        //combaining data 
        submission.assignment = assignmentData

        res.status(200).send(submission);

    } catch (error) {
        console.log(error)
        res.status(400).send({
            error
        })
    }



})

//read student submission detail
router.post('/class/assignment/record/detail', auth, authAdmin, async(req, res) => {


    try {

        const classId = req.body.classId;
        const uniqueId = req.body.uniqueId;    
        const student = await AssignmentSubmit.find({classId, uniqueId})
        let sendRecord = {}
    
        sendRecord.student = student
        // console.log(sendRecord)

        res.status(200).send(sendRecord)

        
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }


})


module.exports = router