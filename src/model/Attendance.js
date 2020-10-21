const mongoose = require('mongoose')
const Class = require('./Class')

const attendanceSchema = new mongoose.Schema({

    classId : {
        required : true,
        type : String
    },
    date : {
        type : String,
        required:true
    },
    start : {
        type : String,
        required:true
    },
    end : {
        type : String,
        required:true
    },
    duration : {
        type : String,
        required:true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    createrName: {
        type : String,
        default:"Digital Classooom"
    }, 
    className: {
        type : String,
        required:true
    },
    students : [
        {
            studentId : {
               type : mongoose.Schema.Types.ObjectId
            },
            name : {
               type : String
            },
            enroll : {
                type: String, 
            }
        }      
    ]
},{
    timestamps : true
})

const Attendance  = mongoose.model("Attendance",attendanceSchema)
module.exports = Attendance;