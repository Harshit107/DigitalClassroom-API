const mongoose = require('mongoose')
require('dotenv').config()


const assignmentSubmitSchema = new mongoose.Schema({

    classId : {
        required : true,
        type : mongoose.Schema.Types.ObjectId
    },
    id : {
        type : String,
    },
    name : {
        type : String
    },
    image : {
        type : String
    },
    enroll : {
        type : String
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

    storageId : {
        type : String,
        required : true
    },
    endDate : {
        type : String
    },
    endTime : {
        type : String
    },
    uniqueId : {
        type : String
    }
},{
    timestamps : true
})



const AssignmentSubmit = mongoose.model('AssignmentSubmit',assignmentSubmitSchema);
module.exports = AssignmentSubmit
