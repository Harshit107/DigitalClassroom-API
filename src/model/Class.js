const mongoose = require('mongoose')
const File = require('../model/File')
const fs = require('fs')


const classSchema = new mongoose.Schema({

    className : {
        type : String,
        trim : true,
        required : true
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
        } 
    }],
    students : [{
        student :{
            type : mongoose.Schema.Types.ObjectId,            
        },
        joined : {
            type: Date, 
            default: Date.now
        }
    }]

},
{
    timestamps : true
})
classSchema.virtual('files', {
    ref : 'File',
    localField : '_id',
    foreignField : 'classId'

})
classSchema.virtual('classworks', {
    ref : 'ClassWork',
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