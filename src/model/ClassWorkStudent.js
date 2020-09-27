const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classworkStudentSchema = new Schema({
    filename: { type: String, required: true },
    orignalname : {type:String,required:true},
    path: { type: String, required: true },
    comment: { type: String },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    senderId: { type: String, required: true },
    classworkId: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('ClassWorkStudent', classworkStudentSchema);