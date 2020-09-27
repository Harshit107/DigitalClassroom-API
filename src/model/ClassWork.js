const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classworkSchema = new Schema({
    filename: { type: String, required: true },
    orignalname : {type:String,required:true},
    path: { type: String, required: true },
    title: { type: String },
    description: { type: String},
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    isLateSubAllowed: { type: Boolean,default:true },
    lastDate: { type: Date },
    senderId: { type: String, required: true },
    classId: { type: String, required: true }
}, { timestamps: true });


classworkSchema.virtual('classworksubmition', {
    ref : 'ClassWorkStudent',
    localField : '_id',
    foreignField : 'classworkId'
})

module.exports = mongoose.model('ClassWork', classworkSchema);