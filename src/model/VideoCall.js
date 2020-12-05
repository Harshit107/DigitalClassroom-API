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
    }

},
{
    timestamps : true
})




const VideoCall = mongoose.model('VideoCall',videoCallSchema);
module.exports = VideoCall;