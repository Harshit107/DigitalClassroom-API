const express = require('express')
const router = new express.Router()
const Class = require('../model/Class.js')
const auth = require('../auth.js')
const authAdmin = require('../authAdmin.js')
const User = require('../model/User.js')
const mongoose = require('mongoose')


//creating class --POST
router.post('/class/create', auth, async (req, res) => {
    try {

        const {className, description} = req.body
        const createrName = req.user.name
        const createrImage = req.user.image == undefined ? "default" : req.user.image;

        const createClass = new Class({
            className,
            description,
            createrName,
            createrImage
        })
        if (!createClass)
            res.status(403).send("No Class Created")

        createClass.users = createClass.users.concat({
            member: req.user._id,
        })
        // console.log(createClass)
        await createClass.save();
        createClass.admins = createClass.admins.concat({
            admin: req.user._id,
            deviceToken : req.user.deviceToken

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


//update class
router.post("/class/update", auth, authAdmin, async(req,res) => {

    try {
        
        const {className,section,room,subject,classId,description} = req.body
        const myClass = await Class.findById(classId);
        if(!myClass)
            res.status(404).send({error:"class not found"})
        myClass.className = className;
        myClass.section = section;
        myClass.room = room;
        myClass.subject = subject;
        myClass.description = description;
        await myClass.save()
        res.status(200).send({message:"Class Updated Successfully"})

    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }


})

//Join user to class 
router.post('/class/join/id/:id', auth, async (req, res) => {
    try {
        var classId = req.params.id
        JSON.stringify(classId)
        const checkClass = await Class.findById(classId)
        if (!checkClass) {
            console.log("no class exist")
            return res.status(404).send({
                error: "Class Not Found"
            })
        }

        const exit = await Class.findOne({
            _id: classId,
            'users.member': req.user._id
        })
        if (exit) {
            return res.status(406).send({
                message: 'User is already in the class'
            })
        }
        const studentJoining = {
            student: req.user._id,
            joined: new Date(),
            deviceToken : req.user.deviceToken
        }
        checkClass.students = checkClass.students.concat(studentJoining)
        checkClass.users = checkClass.users.concat({
            member: req.user._id
        })
        await checkClass.save();
        res.status(201).send({
            checkClass
        })

    } catch (error) {
        console.log("at error Place :" + error.toString)
        res.status(406).send({
            "error": error
        })
    }
})


//leave student
router.post('/class/student/leave/id/:id', auth, async (req, res) => {
    try {
        const studentId = req.user._id
        const classId = req.params.id
        const checkClass = await Class.findById(classId)
        if (!checkClass)
            return res.status(404).send({
                message: "Class Not Found"
            })


        const exit = await Class.findOne({
            _id: classId,
            'users.member': studentId
        })
        if (!exit)
            return res.status(406).send({
                message: 'User not found in the class'
            })

        const newClassUsers = checkClass.users.filter(member => {
            return member.member != studentId.toString()
        })
        const newClassStudent = checkClass.students.filter(student => {
            return student.student != studentId.toString()
        })
        checkClass.users = newClassUsers
        checkClass.students = newClassStudent

        await checkClass.save();
        res.status(201).send({
            checkClass
        })

    } catch (error) {
        console.log(error)
        res.status(406).send({
            error: error
        })
    }
})


router.post('/class/admin/leave/id/:id', auth, authAdmin, async (req, res) => {
    try {
        const adminId = req.user._id
        const classId = req.params.id
        const checkClass = await Class.findById(classId)
        if (!checkClass)
            return res.status(404).send("Class Not Found")


        const exit = await Class.findOne({
            _id: classId,
            'users.member': adminId
        })
        if (!exit)
            return res.status(406).send({
                messgae: 'User not found in the class'
            })

        const newClassUsers = checkClass.users.filter(member => {
            return member.member != adminId.toString()
        })
        const newClassAdmin = checkClass.admins.filter(admin => {
            return admin.admin != adminId.toString()
        })
        if (newClassAdmin.length === 0)
            return res.status(406).send({
                error: "Class must have One admin"
            })
        checkClass.users = newClassUsers
        checkClass.admins = newClassAdmin

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
router.post('/class/add/student', auth, authAdmin, async (req, res) => {

    try {
        const studentId = req.body.to;
        // const studentId = req.body.studentId;
        const myClass = req.user.myClass

        // checking user if exist
        const checkUser = await User.findById(studentId)

        if (!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members) => {
            return members.member == studentId
        })

        if (exist.length !== 0)
            return res.status(406).send({
                messgae: 'User is already in the class'
            })

        // adding user to Users and student
        myClass.users = myClass.users.concat({
            member: studentId
        })
        myClass.students = myClass.students.concat({
            student: studentId,
            deviceToken : req.user.deviceToken
        })
        await myClass.save()
        res.send({
            myClass,
            message: 'User added successfully'
        })

    } catch (error) {
        res.status(404).send(error)
    }



})

//add admin
router.post('/class/add/admin', auth, authAdmin, async (req, res) => {
    try {

        const adminId = req.body.to;
        // const studentId = req.body.studentId;
        const myClass = req.user.myClass

        // checking user if exist
        const checkUser = await User.findById(adminId)

        if (!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members) => {
            return members.member == adminId
        })

        if (exist.length !== 0)
            return res.status(406).send({
                messgae: 'Admin is already in the class'
            })

        // adding user to Users and student
        myClass.users = myClass.users.concat({
            member: adminId
        })
        myClass.admins = myClass.admins.concat({
            admin: adminId,
            deviceToken : req.user.deviceToken

        })
        await myClass.save()
        res.send({
            myClass,
            message: 'User added successfully'
        })

    } catch (error) {
        res.status(404).send(error)
    }
})

//make admin from student
router.post('/class/add/admin/fromStudent', auth, authAdmin, async (req, res) => {
    try {

        const studentId = req.body.to;
        // const studentId = req.body.studentId; admin
        const myClass = req.user.myClass

        // checking user if exist
        const checkUser = await User.findById(studentId)

        if (!checkUser)
            return res.status(404).send('User Not found')

        // checking user is present in that call or not 
        const exist = myClass.users.filter((members) => {
            return members.member == studentId
        })

        if (exist.length === 0)
            return res.status(406).send({
                error: 'User is not in class ! '
            })

        const adminExist = myClass.admins.filter((admin) => {
            return admin.admin == studentId
        })

        if (adminExist.length !== 0)
            return res.status(406).send({
                error: 'User is already an Admin'
            })

        // adding user to Users and student        
        myClass.admins = myClass.admins.concat({
            admin: studentId,
            deviceToken : req.user.deviceToken

        })
        const newClass = myClass.students.filter((student) => {
            return student.student != studentId
        })
        myClass.students = newClass
        await myClass.save()
        res.send({
            myClass,
            error: 'User Changed to Admin successfully'
        })

    } catch (error) {
        res.status(404).send(error)
    }
})

//remove student
router.post('/class/student/remove', auth, authAdmin, async (req, res) => {
    try {

        const studentId = req.body.to;
        // const studentId = req.body.studentId; admin
        const myClass = req.user.myClass

        // checking user if exist
        const checkUser = await User.findById(studentId)

        if (!checkUser)
            return res.status(404).send({error : 'User Not found'})

        // checking user is present in that class or not 
        const exist = myClass.users.filter((members) => {
            return members.member == studentId
        })

        if (exist.length === 0)
            return res.status(406).send({
                error: 'User is not in class ! '
            })


        const newClass = myClass.students.filter((student) => {
            return student.student != studentId
        })
        myClass.students = newClass
        await myClass.save()
        res.send({
            myClass,
            error: 'User removed successfully'
        })

    } catch (error) {
        res.status(404).send(error)
    }
})


//get class Info
router.post('/class/info',async (req, res) => {
    try {
        const classID = req.body.classId
        const cls = await Class.findById(classID)
        if (!cls)
            res.status(404).send({
                error: "Class Not Found"
            })
        res.status(200).send(cls)

    } catch (error) {
        console.log(error)
        res.status(406).send({
            "error": error
        })
    }
})

//demote admin to student
router.post('/class/add/student/fromAdmin', auth, authAdmin, async (req, res) => {
    try {

        const adminId = req.body.to;
        // const studentId = req.body.studentId; admin
        const myClass = req.user.myClass

        // checking user if exist
        const checkUser = await User.findById(adminId)

        if (!checkUser)
            return res.status(404).send({error : 'User Not found'})

        // checking user is present in that calass or not 
        const exist = myClass.users.filter((members) => {
            return members.member == adminId
        })

        if (exist.length === 0)
            return res.status(406).send({
                error: 'User is not in class ! '
            })

        const studentExit = myClass.students.filter((students) => {
            return students.student == adminId
        })
        if (studentExit.length !== 0)
            return res.status(406).send({
                error: 'User is already an Student'
            })
        if (myClass.admins.length < 2)
            return res.status(406).send({
                error: "You cannot leave, class must have one admin! "
            })

        // adding user to Users and student        
        myClass.students = myClass.students.concat({
            student: adminId,
            deviceToken : req.user.deviceToken

        })

        const newClass = myClass.admins.filter((admins) => {
            return admins.admin != adminId
        })
        myClass.admins = newClass
        await myClass.save()
        res.send({
            myClass,
            message: 'User Changed to Student successfully'
        })

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
router.get('/users/classStudent', auth, async (req, res) => {

    try {

        const myClassStudent = await Class.find({
            'students.student': req.user._id
        });
        res.send(myClassStudent)

    } catch (error) {
        console.log({
            error
        })
        res.status(404).send({
            error: "at Error"
        })
    }

})

//class where i m admin
router.get('/users/classAdmin', auth, async (req, res) => {

    try {
        const myClassAdmin = await Class.find({
            'admins.admin': req.user._id
        })
        res.send(myClassAdmin)
    } catch (error) {
        console.log({
            error
        })
        res.status(404).send({
            error
        })
    }

})



//get all info of class People
router.post('/class/people', auth, async (req, res) => {

    try {

        const classId = req.body.classId
        let requestClass = await Class.findOne({
            _id: classId
        })
        if (!requestClass) {
            console.log("Class not found")
            return res.status(400).send({
                error: "Class not found"
            })

        }

        const findAdmin = (async () => {
            let newAdmin = [];
            for (let i = 0; i < requestClass.admins.length; i++) {
                const admins = requestClass.admins[i];
                const {
                    name,
                    image,
                    _id
                } = await User.findById(admins.admin)
                const sendingDetailAdmin = {}
                sendingDetailAdmin.name = name
                sendingDetailAdmin.image = image
                sendingDetailAdmin.id = _id
                newAdmin.push(sendingDetailAdmin)
            }
            return newAdmin
        })

        const findstudent = (async () => {
            let newStudent = [];
            for (let i = 0; i < requestClass.students.length; i++) {
                const students = requestClass.students[i];
                const {
                    name,
                    image,
                    _id
                } = await User.findById(students.student)
                const sendingDetailStudent = {}
                sendingDetailStudent.name = name
                sendingDetailStudent.image = image
                sendingDetailStudent.id = _id
                newStudent.push(sendingDetailStudent)
            }
            return newStudent

        })

        const newS = await findstudent()
        const newA = await findAdmin() 
        requestClass.admins = undefined
        requestClass.students = undefined
        const classInfo = {
            requestClass,
            students : newS,
            admins : newA
        }
        res.status(200).send(classInfo)

    } catch (error) {
        console.log("here" + error)
        res.status(400).send({
            error: error
        })
    }



})


router.get('/class/people/student', auth, async (req, res) => {

    const classId = req.body.classId
    const requestClass = await Class.findOne({
        _id: classId
    })
    if (!requestClass)
        return res.status(404).send('Class not found')
    res.send(requestClass.students)

})


router.get('/class/people/admin', auth, async (req, res) => {

    const classId = req.body.classId
    const requestClass = await Class.findOne({
        _id: classId
    })
    if (!requestClass)
        return res.status(404).send('Class not found')
    res.send(requestClass.admins)

})


router.delete('/class/delete/:id', async (req, res) => {

    const mClass = await Class.findById(req.params.id);
    if (!mClass)
        return res.status(404).send({
            error: 'Class not found'
        })
    await mClass.deleteOne()
    res.status(200).send("Ok")
})




module.exports = router