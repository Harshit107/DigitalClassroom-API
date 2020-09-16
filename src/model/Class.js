const mongoose = require('mongoose')


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
    admin : [{
        type :
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



const Class = mongoose.model('Class',classSchema)
module.exports = Class