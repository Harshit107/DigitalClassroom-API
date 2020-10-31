const Class = require('../model/Class')
const User = require('../model/User')
const router = require('express').Router()
const auth = require('../auth')





//Only for developer
// allfilefromclass
router.get('/class/file/all',async(req,res)=> {

    const allFile = await File.find()
    res.send(allFile)
  
  })

//*****///**--------------Highlt Risky ---------********** */ */4
router.delete('/class', async (req, res) => {
    await Class.deleteMany()
    res.send("OK")
})


// Auth check Dev
router.get('/authcheck', auth, async (req, res) => {
    res.status(200).send({
        message: "OK"
    })
})

//delete all user 
router.delete('/users', async (req, res) => {
    await User.deleteMany()
    res.send(User)
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
module.exports = router