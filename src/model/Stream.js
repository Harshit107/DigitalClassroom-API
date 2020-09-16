const mongoose = require('mongoose')
require('dotenv').config()


const streamSchema = new mongoose.Schema({

    title : {
        type : String,
        trim : true,
        required : true
    },
    description : {
        type : String,
        trim :true
    },
    file : {
        type : Buffer
    }

},{
    timestamps : true
})


const Stream = mongoose.model('Stream',streamSchema)
module.exports = Stream



