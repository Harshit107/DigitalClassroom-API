const express = require('express')
const router = new express.Router()
const Stream = require('../model/Stream.js')
const auth = require('../auth.js')



router.post('/stream', auth, (req,res)=> {

    const classId = req.body
    console.log(classId)

})
