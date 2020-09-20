const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../model/File');
const { v4: uuidv4 } = require('uuid');
const authAdmin = require('../authAdmin');
const auth = require('../auth');
const Class = require('../model/Class');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 100000 * 100 }, }).single('File');

router.post('/class/file/upload', auth,authAdmin, async(req,res)=> {

  // await authAdmin(req,res,()=>{})
    upload(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
          const file = new File({
              filename: req.file.filename,
              uuid: uuidv4(),
              path: req.file.path,
              size: req.file.size,
              senderId: req.user._id,
              classId: req.user.myClass._id,
              orignalname:req.file.originalname
          });
          const response = await file.save();
          res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        });
})

/***      all Files related with the class      ***/

router.get('/class/file/read',auth , async(req,res)=> {

  if(!req.body.classId)
    return res.status(404).send({error : "class not found"})
  const myClass = await Class.findById(req.body.classId)

  if(!myClass)
    return res.status(404).send({error : "class not found"})
   await myClass.populate('files').execPopulate();
  // console.log(myClass,files)
  res.send(myClass.files)
})






router.get('/class/file/all',async(req,res)=> {

  const allFile = await File.find()
  res.send(allFile)

})


module.exports = router