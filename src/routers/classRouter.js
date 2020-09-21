const express = require('express')
const router = new express.Router()
const Class = require('../model/Class.js')
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const User = require('../model/User.js')




//creating class --POST
router.post('/class/create', auth, async (req, res) => {
    try {

        const createClass = new Class(req.body)
        if (!createClass)
            res.status(403).send("No Class Created")

        createClass.users = createClass.users.concat({member : req.user._id})
        // console.log(createClass)
        await createClass.save();
        createClass.admins = createClass.admins.concat({
            admin: req.user._id
        })
        await createClass.save()
        res.status(201).send({
            createClass
        })

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})


//add user to class 
router.post('/class/join/id/:id', auth, async (req, res) => {
    try {
        const classId = req.params.id
        const checkClass = await Class.findById(classId)
        if (!checkClass)
            return res.status(404).send("Class Not Found")

        const exit = await Class.findOne( {_id : classId, 'users.member' : req.user._id })
        if(exit)
            return res.status(406).send({messgae:'User is already in the class'})
        const studentJoining = {
            student: req.user._id,
            joined: new Date()
        }
        checkClass.students = checkClass.students.concat(studentJoining)
        await checkClass.save();
        res.status(201).send({
            checkClass
        })

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})

//add student
router.post('/class/add/student', auth, authAdmin, async (req,res)=> {

    try {
        const studentId = req.body.to;
        // const studentId = req.body.studentId;
        const myClass = req.user.myClass
        
        // checking user if exist
        const checkUser = await User.findById(studentId)

        if(!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members)=> {
            return members.member == studentId
        })
        
        if(exist.length !== 0)
            return res.status(406).send({messgae:'User is already in the class'})

        // adding user to Users and student
        myClass.users = myClass.users.concat({member : studentId})
        myClass.students = myClass.students.concat({student : studentId})
        await myClass.save()
        res.send({myClass,message : 'User added successfully'})

    } catch (error) {
        res.status(404).send(error)
    }

    

})

//add admin
router.post('/class/add/admin', auth, authAdmin, async (req,res)=> {
    try {

        const adminId = req.body.to;
        // const studentId = req.body.studentId;
        const myClass = req.user.myClass
        
        // checking user if exist
        const checkUser = await User.findById(adminId)

        if(!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members)=> {
            return members.member == adminId
        })
        
        if(exist.length !== 0)
            return res.status(406).send({messgae:'Admin is already in the class'})

        // adding user to Users and student
        myClass.users = myClass.users.concat({member : adminId})
        myClass.admins = myClass.admins.concat({admin : adminId})
        await myClass.save()
        res.send({myClass,message : 'User added successfully'})

    } catch (error) {
        res.status(404).send(error)
    }
})

//make admin from student
router.post('/class/add/admin/fromStudent', auth, authAdmin, async (req,res)=> {
    try {

        const studentId = req.body.to;
        // const studentId = req.body.studentId; admin
        const myClass = req.user.myClass
        
        // checking user if exist
        const checkUser = await User.findById(studentId)

        if(!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members)=> {
            return members.member == studentId
        })
        
        if(exist.length === 0)
            return res.status(406).send({messgae:'User is not in class ! '}) 

        const adminExist = myClass.admins.filter((admin)=> {
            return admin.admin == studentId
        })
        
        if(adminExist.length !== 0)
            return res.status(406).send({messgae:'User is already an Admin'})

        // adding user to Users and student        
        myClass.admins = myClass.admins.concat({admin : studentId})
        const newClass = myClass.students.filter((student)=> {
            return student.student != studentId
        })        
         myClass.students = newClass
        await myClass.save()
        res.send({myClass,message : 'User Changed to Admin successfully'})

    } catch (error) {
        res.status(404).send(error)
    }
})

//get class Info
router.get('/class/id/:id', async (req, res) => {
    try {
        const classID = req.params.id
        const cls = await Class.findById(classID)
        if (!cls)
            res.status(404).send({
                error: "Class Not Found"
            })
        console.log(cls)
        res.status(200).send(cls)

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})

//demote admin to student
router.post('/class/add/student/fromAdmin', auth, authAdmin, async (req,res)=> {
    try {

        const adminId = req.body.to;
        // const studentId = req.body.studentId; admin
        const myClass = req.user.myClass
        
        // checking user if exist
        const checkUser = await User.findById(adminId)

        if(!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that calass or not 
        const exist = myClass.users.filter((members)=> {
            return members.member == adminId
        })
        
        if(exist.length === 0)
            return res.status(406).send({messgae:'User is not in class ! '}) 

        const studentExit = myClass.students.filter((students)=> {
            return students.student == adminId
        })
        if(studentExit.length !== 0)
            return res.status(406).send({messgae:'User is already an Student'})
        if(myClass.admins.length <2 )
            return res.status(406).send({error : "You cannot leave, class must have one admin! "})

        // adding user to Users and student        
        myClass.students = myClass.students.concat({student : adminId})

        const newClass = myClass.admins.filter((admins)=> {
            return admins.admin != adminId
        })        
         myClass.admins = newClass
        await myClass.save()
        res.send({myClass,message : 'User Changed to Student successfully'})

    } catch (error) {
        res.status(404).send(error)
    }
})

//get class Info
router.get('/class/id/:id', async (req, res) => {
    try {
        const classID = req.params.id
        const cls = await Class.findById(classID)
        if (!cls)
            res.status(404).send({
                error: "Class Not Found"
            })
        console.log(cls)
        res.status(200).send(cls)

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})







//get my class using populate
router.get('/users/class',auth, async(req,res)=> {
    await req.user.populate('classes').execPopulate();
    res.send(req.user.classes)
})


///get all class dev
router.get('/class', async (req, res) => {
    try {
        const cls = await Class.find()
        if (!cls)
            res.status(404).send({
                error: "Class Not Found"
            })
        console.log(cls)
        res.status(200).send(cls)

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})

router.get('/class/people',auth, async(req,res)=> {

    const classId = req.body.classId
    const requestClass = await Class.findOne({ _id : classId })
    if(!requestClass)
        return res.status(404).send('Class not found')
    res.send(requestClass.users)

}) 
router.get('/class/people/student',auth, async(req,res)=> {

    const classId = req.body.classId
    const requestClass = await Class.findOne({ _id : classId })
    if(!requestClass)
        return res.status(404).send('Class not found')
    res.send(requestClass.students)

}) 
router.get('/class/people/admin',auth, async(req,res)=> {

    const classId = req.body.classId
    const requestClass = await Class.findOne({ _id : classId })
    if(!requestClass)
        return res.status(404).send('Class not found')
    res.send(requestClass.admins)

}) 


router.delete('/class/delete/:id', async( req, res ) =>{

    const mClass =await Class.findById(req.params.id);
    if(!mClass)
        return res.status(404).send( {error: 'Class not found'})
    await mClass.deleteOne()
    res.status(200).send("Ok")
})










module.exports = router