const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const VideoCall = require('../model/VideoCall');
const auth = require('../auth');
const fetch = require('node-fetch');



router.post('/class/videoCall/create',auth, async(req, res) => {

    const classId = req.body.classId;
    const orignalLink = 'https://meet.jit.si/';
    const myLink = 'https://digitalclassroom.ml/meeting/';


    try {
        const createdBy = req.user.name;
        const createrId = req.user._id;
        const videoMeeting = new VideoCall({
            classId,
            createdBy,
            createrId
        })
        videoMeeting.generatedLink =myLink+videoMeeting._id.toString();
        videoMeeting.orignalLink =orignalLink+videoMeeting._id.toString();
        await videoMeeting.save();
        console.log(videoMeeting);

        res.status(200).send(videoMeeting);
    
    } catch (error) {
        console.log({error});
        res.status(404).send({error: error});
    }

});

router.get('/videoCall/meeting/:id', async function(req, res){  

    const videoId = req.params.id;
    if(videoId.length != 24 )
        return res.status(400).send({error: 'Invalid meeting Code'});
    console.log(videoId);
    const videoCode = await VideoCall.findById(videoId);
    if(!videoCode)
        return res.status(404).send({error : "Meeting code not found"});
    res.redirect(videoCode.orignalLink);
})


router.get('/videoCall/meeting/code', async function(req, res){  

    const videoId = req.body.id;
   
    try{

    if(videoId.length != 24 )
        return res.status(400).send({error: 'Invalid meeting Code'});
    console.log(videoId);
    const videoCode = await VideoCall.findById(videoId);
    if(!videoCode)
        return res.status(404).send({error : "Meeting code not found"});
    res.send({code : videoCode.orignalLink});


    }catch (error) {
        console.log({error})
        res.status(400).send({error})
    }
})


module.exports = router;

