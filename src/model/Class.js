const mongoose = require('mongoose')
const fs = require('fs')


const classSchema = new mongoose.Schema({
    className : {
        type : String,
        trim : true,
        required : true
    },
    createrName : {
        type : String,
    },
    createrImage : {
        type : String,
    },
    createdBy : {
        type : String,
        trim : true
    },
    section : {
        type : String,
        trim : true,
    }, 
    subject : {
        type : String,
        trim : true,
    },
    room : {
        type : String,
        trim : true,
    },
    description : {
        type : String,
        trim : true,
    },
    users: [{
        member :{
            type : mongoose.Schema.Types.ObjectId,
            required:true,
        }
    }],
    admins : [{
        admin :
        {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
        },
        deviceToken : {
            type : String
        } 
    }],
    students : [{
        student :{
            type : mongoose.Schema.Types.ObjectId,            
        },
        joined : {
            type: Date, 
            default: Date.now
        },
        deviceToken : {
            type : String
        }
    }]

},
{
    timestamps : true
})
classSchema.virtual('classworks', {
    ref : 'ClassWork',
    localField : '_id',
    foreignField : 'classId'

})
classSchema.virtual('attendanceRecord', {
    ref : 'Attendance',
    localField : '_id',
    foreignField : 'classId'

})
classSchema.virtual('streamData', {
    ref : 'Stream',
    localField : '_id',
    foreignField : 'classId'

})
classSchema.virtual('assignmentData', {
    ref : 'Assignment',
    localField : '_id',
    foreignField : 'classId'

})


classSchema.pre('deleteOne', { document: true}, async function(next){
    const myClass = this;

    const allFiles = await File.find({classId : myClass._id})

    allFiles.forEach( file => {
        const path = file.path

        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return res.status(404).send({
              error : err
            })
          }
        })
        file.deleteOne()
    })
    
    //await File.deleteMany({classId : myClass._id})
    next()
})


const Class = mongoose.model('Class',classSchema)
module.exports = Class