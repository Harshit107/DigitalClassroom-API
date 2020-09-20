const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const File = require('../model/File')


router.get('/files/:uuid', async (req, res) => {

    try {
        const file = await File.findOne({
            uuid: req.params.uuid
        })
        if (!file) {
            return res.status(404).send({
                error: 'File Not Found'
            })
        }
        res.download(file.path)

    } catch (error) {
        res.status(404).send({error})
    }
})



module.exports = router