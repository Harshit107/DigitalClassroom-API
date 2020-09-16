const express = require('express')
const router = new express.Router()
const Class = require('../model/Class.js')
const auth = require('../auth.js')




//creating class --POST
router.post('/class/create', auth, async (req, res) => {
    try {
        // const createClass = new Class({...req.body,
        //     users: req.user._id})
        const createClass = new Class(req.body)
        if (!createClass)
            res.status(403).send("No Class Created")

        createClass.users = createClass.users.concat({member : req.user._id})
        // console.log(createClass)
        await createClass.save();
        createClass.admin = createClass.admin.concat({
            _id: req.user._id
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
router.post('/class/join/:id', auth, async (req, res) => {
    try {
        const classId = req.params.id
        const checkClass = await Class.findById(classId)
        if (!checkClass)
            return res.status(404).send("Class Not Found")

        const exit = await Class.findOne( {_id : classId, 'students.student' : req.user._id })
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

//get class Info
router.get('/class/:id', async (req, res) => {
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

router.delete('/class', async (req, res) => {
    await Class.deleteMany()
    res.send("OK")
})

module.exports = router