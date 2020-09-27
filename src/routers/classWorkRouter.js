const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const ClassWork = require('../model/ClassWork');
const {
  v4: uuidv4
} = require('uuid');
const authAdmin = require('../authAdmin');
const auth = require('../auth');
const Class = require('../model/Class');
const fs = require('fs');



/*****    -------   for file upload  ---------    *******/
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
}).single('ClassWork');

router.post('/class/classwork/admin/upload', auth, authAdmin, async (req, res) => {

  try {
    const lastDate = req.body.lastDate
    const lateSub = req.body.lateSub
    const title = req.body.title
    const description = req.body.description
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
        isLateSubAllowed: lateSub,
        lastDate: lastDate,
        title,
        description

      });
      const response = await file.save();
      res.json({
        file: `${process.env.APP_BASE_URL}/class/classwork/${response.uuid}`
      });
    });
  } catch (error) {
    console.log(error)
    res.status(406).send({
      error
    })
  }
})


/***      all Files related with the class      ***/
router.get('/class/classwork/read', auth, async (req, res) => {

  if (!req.body.classId)
    return res.status(404).send({
      error: "class not found"
    })
  const myClass = await Class.findById(req.body.classId)

  if (!myClass)
    return res.status(404).send({
      error: "class not found"
    })
  await myClass.populate('classworks').execPopulate();
  res.send(myClass.classworks)
})


/*****    -------   for file delete  ---------    *******/

//delete file with the id of the file
// admin auth is require
router.delete('/class/classwork/delete/:id', auth, authAdmin, async (req, res) => {

  try {
    const file = await ClassWork.findOne({
      _id: req.params.id
    })
    if (!file) {
      return res.status(404).send({
        error: 'File Not Found'
      })
    }
    const path = file.path

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return res.status(404).send({
          error: err
        })
      }
    })
    await file.deleteOne()
    res.send({
      message: 'File Deleted Successfully'
    })
  } catch (error) {
    res.status(404).send({
      error
    })
  }
})





//download file 
router.get('/class/classwork/download/:uuid', async (req, res) => {

  try {
    const file = await ClassWork.findOne({
      uuid: req.params.uuid
    })
    if (!file) {
      return res.status(404).send({
        error: 'File Not Found'
      })
    }
    res.download(file.path)

  } catch (error) {
    res.status(404).send({
      error
    })
  }
})
router.get('/class/classwork/student/submission/:id', async (req, res) => {

  try {
    const classwork = await ClassWork.findOne({
      _id: req.params.id
    })
    if (!classwork) {
      return res.status(404).send({
        error:'Something went wrong'
      })
    }
    const totalsubmission = ClassWork.populate('ClassWorkStudent').execPopulate()
    res.send(totalsubmission)

  } catch (error) {
    res.status(404).send({
      error
    })
  }
})




module.exports = router