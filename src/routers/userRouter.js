const express = require('express')
const router = new express.Router()
const User = require('../model/User.js')
const auth = require('../auth.js')
const sendEmail = require('../email/verifyEmail')
const sendMail = require('../email/sendMail')
const path = require('path')
const { route } = require('./developerRouter.js')

router.get('/verify/email/:id',async(req,res)=> {

    try {
        
    const id = req.params.id;
    const user = await User.findOne( {_id : id } )
    
    const htmlPath = path.join(__dirname, '../../');
    

    if(!user)
        return res.status(404).send({error : 'Link expired'})
    if(user.isVerified)
        return res.sendFile(htmlPath + 'public/email_already_verified.html');  
    user.isVerified = true;
    await user.save()


    try {
         res.sendFile(htmlPath + 'public/email_verified.html');   
    } catch (error) {
        console.log({error})
        res.status(200).send({message : 'User Verified Successfully'})

    }
    
    // 
    } catch (error) {
        const htmlPath = path.join(__dirname, '../../');
        res.status(404).send({error : 'User Id No Found'})  
    }


})

//creating User --POST
router.post('/users/create', async (req, res) => {
    const user = req.body

    try {
        const fUser = await User.find({email : req.body.email})
        if(fUser.length > 0 )
            return res.status(404).send({error : "User is already registered with us"})


        const createNewUser = new User(user)
        if (!createNewUser)
            res.status(403).send("No user Found")
        await createNewUser.save();
        const token = await createNewUser.generateToken()
        const userId = createNewUser._id;
        await sendEmail(createNewUser.email,createNewUser._id)
        res.status(201).send({
            createNewUser,
            token,
            userId

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
        const deviceToken = req.body.deviceToken;
        if(deviceToken){
            user.deviceToken = deviceToken
            user.save();
        }
        const userId = user._id;
        

        res.status(201).send({
            user,
            token,
            userId
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            error:error
        })
    }
})

//logout
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

//password change
router.patch("/users/update", auth, async (req, res) => {

    const myId = req.user._id
    const updates = Object.keys(req.body)
    const allowed = ['password',"phone","enroll","image"]
    const isValid = updates.every((update)=>allowed.includes(update))

    if(!isValid)
        return res.status(402).send({error:"Request Field can't be Changes"})
        
    try {

        const user = await User.findById(myId)
        updates.forEach((element) => {
            user[element] = req.body[element]
        });
       //directly update without validate 
      // const user =  await User.findByIdAndUpdate(myId,req.body,{ new:true, runValidators:true })
      await user.save();

        if (!user)
            return res.status(404).send()
        res.status(200).send(user)
    } catch (err) {
        res.status(403).send(err)
    }
})

router.post("/users/password/reset",  async (req, res) => {

    const myId = req.body._id
    const password = req.body.password;    
    try {
        const user = await User.findById(myId)
        user.password = password
       //directly update without validate 
      // const user =  await User.findByIdAndUpdate(myId,req.body,{ new:true, runValidators:true })
      await user.save();
        if (!user)
            return res.status(404).send()
        res.status(200).send(user)
    } catch (err) {
        console.log(err)
        res.status(403).send(err)
    }
})

//making a static to serve
router.use(express.static(__dirname + '../../..'))

router.get("/users/send/resetfile/:id",  (req, res) => {

    const myId = req.params.id;
    const pubPath = path.join(__dirname + "../../..")
    console.log(pubPath)
    res.sendFile('/public/forgetpassword.html',{root: pubPath});
 
})

router.post('/users/password/request', async (req, res) => {

    console.log("Requesting")
    try {
        const email = req.body.email;
        const userID = await User.find({ email })
        if (!userID)
            return res.status(404).send({error : "User not found"})
        const url = `https://digitalclassroom.herokuapp.com/users/send/resetfile/${userID[0]._id}`
        // const url = `http://localhost:3000/users/send/resetfile/${userID[0]._id}`

        //------------------------------------------------------------------------------

        const message = `Hi  ${userID[0].name},\n
        You requested to reset the password for your digital-classroom account with the e-mail address
         ${email}. Please click this link to reset your password.\n\n${url}\n\nThanks\nHarshit keshari`
        
        const messageWEB = `Hi ${userID[0].name},<br>
        You requested to reset the password for your digital-classroon account with the e-mail address
         ${email}. Please click this link to reset your password.<br><br>${url}<br><br>Thanks<br>Harshit keshari`
        
        const preHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        </head>
        <body style=" color: black; text-align: center ">
    
        <div style="margin-top: 100px;">
        <img src="https://harshit107.netlify.app/img/rmail-logo.png"
         style="width: 100px; height: 100px; margin-top : 20px" >
         <p style="font-size: 28px;">Reset Password</p>
         <p style="font-size: 18px;">${messageWEB}</p>
         <a href=${url} style=" text-decoration: none; color: white; font-size : 20px; padding: 7px 20px; background-color: #75c0f1;">Reset</a>
    </div>
    </body>
    </html>`
    
        //------------------------------------------------------------------------------
        await sendMail(email,message, preHtml)
        res.send({message:'ok'})
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }

})




//populate


module.exports = router