const express = require('express')
const router = new express.Router()
const auth = require('../auth.js')
const path = require('path')
const Class = require('../model/Class')
const multer = require('multer')
const ClassWork = require('../model/ClassWork.js')



let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName)
    },
  });
  let upload = multer({
    storage,
    limits: {
      fileSize: 100000 * 100
    },
  }).single('ClassWorkSubmit');


///not completed
router.post('/class/classwork/student/submit',auth,  (req,res)=> {

    const classworkId = req.header.classworkId
    const comment = req.header.comment

    try {

        const myClasswork = await ClassWork.find({_id : classworkId})
        if(!myClasswork)
            return res.status(404).send({error : 'classwork not found'})

        

        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                error: err.message
                });
            }
            const file = new ClassWork({
                filename: req.file.filename,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size,
                senderId: req.user._id,
                classId: req.user.myClass._id,
                orignalname: req.file.originalname,
                comment        
              });
              const response = await file.save();
              res.json({
                file: `${process.env.APP_BASE_URL}/class/classwork/${response.uuid}`
              });
            });

    } catch (error) {
        return res.status(404).send({error})
    }


})


