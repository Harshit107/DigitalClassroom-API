const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const File = require('../model/File')
const fs = require('fs');
const authAdmin = require('../authAdmin');
const auth = require('../auth');


router.delete('/class/file/delete/:id',auth , authAdmin, async (req, res) => {

  try {
    const file = await File.findOne({
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
          error : err
        })
      }
    })
    await file.deleteOne()
    res.send({
      message : 'File Deleted Successfully'
    })
  } catch (error) {
    res.status(404).send({
      error
    })
  }
})



module.exports = router