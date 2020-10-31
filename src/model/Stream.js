const mongoose = require('mongoose')
require('dotenv').config()


const streamSchema = new mongoose.Schema({

    classId : {
        required : true,
        type : mongoose.Schema.Types.ObjectId
    },
    createdBy : {
        type : String,
        required : true
    },
     createrImage : {
        type : String
    },
    createrId : {
        type : String,
        required : true
    },
    message : {
        type :String,
        required : true
    },
    link : {
        type :String
    },
    fileInclude : {
        type : Boolean
    },
    fileName : {
        type :String,

    },
    fileType : {
        type :String
    },
    file : {
        type :String
    },
    imageInclude : {
        type : Boolean
    },
    image : {
        type : String
    },
    imageName : {
        type :String
    },
    storageId : {
        type : String,
        required : true
    }

},{
    timestamps : true
})





const Stream = mongoose.model('Stream',streamSchema);
module.exports = Stream
