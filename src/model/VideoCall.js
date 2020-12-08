const mongoose = require('mongoose');
require('dotenv').config()

const videoCallSchema = new mongoose.Schema({

    classId : {
        type : String,
        required : true
    },
    orignalLink : {
        type : String
    },
    generatedLink : {
        type : String,
    },
    createdBy : {
        type : String,
    },
    createrId : {
        type : mongoose.Schema.Types.ObjectId
    },
    kickOut : {
        type : Boolean,
        default : true
    },
    chat : {
        type : Boolean,
        default : true
    },
    password : {
        type : Boolean,
        default : true
    },
    raiseHand : {
        type : Boolean,
        default : true
    },
    videoSharing : {
        type : Boolean,
        default : true
    },
    timer : {
        type : Boolean,
        default : true
    }


},
{
    timestamps : true
})




const VideoCall = mongoose.model('VideoCall',videoCallSchema);
module.exports = VideoCall;