const mongoose = require('mongoose')
require('dotenv').config()


const chatStream = new mongoose.Schema({

    classId : {
        type : String,
        required : true
    },
    uniqueId : {
        type : String,
        required : true
    },
    senderName : {
        type : String,
        required : true
    },
    senderImage : {
        type : String
    },
    senderId : {
        type : String,
        required : true
    },
    message : {
        type :String,
        required : true
    },
    date : {
        type :String
    }

},{
    timestamps : true
})





const Chat = mongoose.model('Chat',chatStream);
module.exports = Chat
