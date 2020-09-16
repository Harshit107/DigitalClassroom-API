const express = require('express')
const router = new express.Router()
const User = require('../model/User.js')
const auth = require('../auth.js')
const bcrypt = require('bcrypt')





//creating User --POST
router.post('/users/create', async (req, res) => {
    const user = req.body

    try {
        const createNewUser = new User(user)
        if (!createNewUser)
            res.status(403).send("No user Found")
        await createNewUser.save();
        const token = await createNewUser.generateToken()
        res.status(201).send({
            createNewUser,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(403).send({
            "error": error
        })
    }
})
router.post('/users/login', async (req, res) => {

    //console.log(req.body.email+" "+ req.body.password)
    try {
        const user = await User.findByCredentails(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            error
        })
    }
})
router.post('/users/logout', auth, async (req, res) => {

    //console.log(req.body.email+" "+ req.body.password)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)

    } catch (error) {
        console.log(error)
        res.status(404).send({
            error
        })
    }
})



//checking profile with Id 
router.get('/profile', auth, async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        res.status(200).send(user)


    } catch (error) {
        res.status(403).send({
            "Error": error
        })
    }
})

//  find all user Dev..
router.get('/users', async (req, res) => {
    try {
        const user = await User.find()
        if (!user)
            res.status(404).send({
                message: "User not Found"
            })
        res.status(200).send(user)
        console.log(user)

    } catch (error) {
        console.log(error)
        res.status(403).send({
            "Error": error
        })
    }
})





// Auth check Dev
router.post('/authcheck', auth, async (req, res) => {
    res.status(200).send({
        message: "OK"
    })
})

//delete all user 
router.delete('/users', async (req, res) => {
    await User.deleteMany()
    res.send(User)
})


module.exports = router