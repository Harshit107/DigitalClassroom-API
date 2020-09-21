const express = require('express')
const router = new express.Router()
const User = require('../model/User.js')
const auth = require('../auth.js')
const sendEmail = require('../email/verifyEmail')


router.get('/verify/email/:id',async(req,res)=> {

    try {
        
    const id = req.params.id;
    const user = await User.findOne( {_id : id } )
    if(!user)
        return res.status(404).send({error : 'Link expired'})
    if(user.isVerified)
        return res.status(200).send({message : 'User is already Verified'})
    user.isVerified = true;
    await user.save()
    res.status(200).send({message : 'User Verified Successfully'})

    } catch (error) {
        res.status(404).send({error : 'User Id No Found'})  
    }


})

//creating User --POST
router.post('/users/create', async (req, res) => {
    const user = req.body

    try {
        const createNewUser = new User(user)
        if (!createNewUser)
            res.status(403).send("No user Found")
        await createNewUser.save();
        const token = await createNewUser.generateToken()
        await sendEmail(createNewUser.email,createNewUser._id)
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


// search user by name or email

router.post('/users/search/email', auth, async(req,res)=>{

    const search = req.body.email
    const user = await User.findOne({ email: search})
    if(!user)
        return res.status(404).send({message:"User Not found"})
    res.status(200).send(user)

})
router.post('/users/search/name', auth, async(req,res)=>{

    const search = req.body.name
    const user = await User.find({ name: {$regex : '^'+search}})
    if(!user)
        return res.status(404).send({message:"User Not found"})
    res.status(200).send(user)

})



//populate


module.exports = router