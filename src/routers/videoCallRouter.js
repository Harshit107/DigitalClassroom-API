const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const VideoCall = require('../model/VideoCall');
const auth = require('../auth');
const fetch = require('node-fetch');



router.post('/class/videoCall/create', auth, async (req, res) => {

    const classId = req.body.classId;
    const orignalLink = 'https://meet.jit.si/';
    const myLink = 'https://digitalclassroom.ml/meeting/';


    try {
        req.body.createdBy = req.user.name;
        req.body.createrId = req.user._id;
        const videoMeeting = new VideoCall(req.body)
        videoMeeting.generatedLink = myLink + videoMeeting._id.toString();
        videoMeeting.orignalLink = orignalLink + videoMeeting._id.toString();
        await videoMeeting.save();
        console.log(videoMeeting);

        res.status(200).send(videoMeeting);

    } catch (error) {
        console.log({
            error
        });
        res.status(404).send({
            error: error
        });
    }

});

router.get('/videoCall/meeting/code/:id',auth, async function (req, res) {

    try {
        const videoId = req.params.id;
        console.log(videoId);
        if (videoId.length != 24)
            return res.status(400).send({
                error: 'Invalid meeting Code'
            });
        const videoCode = await VideoCall.findById(videoId);
        if (!videoCode)
            return res.status(404).send({
                error: "Meeting code not found"
            });
        res.send(videoCode);

    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: error
        });
    }


})


router.get('/videoCall/meeting/code', auth, async function (req, res) {

    const videoId = req.body.id;

    try {

        if (videoId.length != 24)
            return res.status(400).send({
                error: 'Invalid meeting Code'
            });

        // const videoClassId = 

        console.log(videoId);
        const videoCode = await VideoCall.findById(videoId);
        if (!videoCode)
            return res.status(404).send({
                error: "Meeting code not found"
            });


        res.send({
            message: "ok"
        });

    } catch (error) {
        console.log({
            error
        })
        res.status(400).send({
            error
        })
    }
})


module.exports = router;