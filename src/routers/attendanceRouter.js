const express = require('express')
const router = new express.Router()
const Attendance = require('../model/Attendance')
const Class = require('../model/Class')
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const User = require('../model/User.js')
const mongoose = require('mongoose')
const fs = require('fs');
const { match } = require('assert')


//create attendance 
router.post('/class/attendance/create', auth, authAdmin, async (req, res) => {
    
    try {
        req.body.createrName = req.user.name,
        req.body.createdBy = req.user._id
        req.body.className = req.user.myClass.className
        
        const attendanceCreated = new Attendance(req.body)
        await attendanceCreated.save();
        res.send(attendanceCreated)


    } catch (error) {
        console.log(error)
        res.status(404).send({
            error
        })
    }

})

//view attendance  Record history of all day
router.post('/class/attendance/admin/record', auth, authAdmin, async (req, res) => {

    let match = {date : req.header('date')}
    if(!match.date)
        match={}



    try {
        await req.user.myClass.populate({
            path : "attendanceRecord",
            options : {
                sort : {
                    date : -1
                }
            },
            match
        })
        .execPopulate();
        res.send(req.user.myClass.attendanceRecord)


    } catch (error) {
        console.log(error)
        res.status(404).send({
            error
        })
    }

})

//remove atendnce
router.post('/class/attendance/record/remove', auth, authAdmin, async (req, res) => {

    try {
        const myRecord = await Attendance.findById(req.body.attendanceId)
        await myRecord.remove()
        res.send({message : "success"})


    } catch (error) {
        console.log(error)
        res.status(404).send({
            error
        })
    }

})

//to 
router.post('/class/attendance/record/download',auth, authAdmin,  async(req, res)=>{

    const attendanceId = req.body.attendanceId;

    try {  
        const attendanceList = await Attendance.findById(attendanceId)
        console.log(attendanceList.students)
        // res.status(200).send("Hello")


    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }


})

//detail of attendance submited by student
router.post('/class/attendance/record/detail',auth, authAdmin,  async(req, res)=>{
    try {
        
        const attendanceId = req.body.attendanceId;
        const attendanceList = await Attendance.findById(attendanceId)

        if(!attendanceList)
        return res.status(404).send({error : "No Schedule Found"})

        const detail = {
            student : attendanceList.students
        }
        res.send(detail)

        
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }


})

//student attendance record of all day
router.post('/class/attendance/student/record', auth, async (req, res) => {

    let match = {date : req.header('date')}
    if(!match.date)
        match={} 

    const myClass = await Class.findById(req.header('classId'))
    try {
        await myClass.populate({
            path : "attendanceRecord",
            options : {
                sort : {
                    date : -1
                }
            },
            match
        })
        .execPopulate();
        const details = {
            attendanceDetail : myClass.attendanceRecord,
            myId : req.user._id
        }
        res.status(200).send(details)


    } catch (error) {
        console.log(error)  
        res.status(404).send({
            error
        })
    }

})



router.post('/class/attendance/student/mark',auth, async(req,res) => {

    try {
        const attendanceId = req.body.attendanceId;
        const attendanceList = await Attendance.findById(attendanceId)

        if(!attendanceList)
         return res.status(404).send({error : "No Schedule Found"})

         const isPresent = attendanceList.students.filter(user => {
            return JSON.stringify(req.user._id) === JSON.stringify(user.studentId)
         })

        if(isPresent.length>0){
            return res.status(400).send({error : "Attendance Cannot be marked twice "})
        }
        const detail = {
            name : req.user.name,
            enroll : req.user.enroll || 00 ,
            studentId:req.user._id
        }
        attendanceList.students.push(detail)
        await attendanceList.save()
        res.send({message : "success"})

        
    } catch (error) {
        console.log({error})
        res.status(400).send({error})
    }


} )


module.exports = router