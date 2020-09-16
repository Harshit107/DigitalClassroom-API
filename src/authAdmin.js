const mongoose = require('mongoose');
const auth = require('./auth.js');
const Class = require('./model/Class.js')




const authAdmin = async (req,res,next) => {

    try {
        const user = req.user
        const classId = req.body.classId;
        // const studentId = req.body.studentId;
        const getClass = await Class.findOne({ _id : classId, 'admins.admin' : user._id})
        if(!getClass)
            return res.status(404).send({error:'Only admin can add user'})
        req.user.myClass = getClass
        
        next()

    } catch (error) {
        res.status(404).send(error)
    }

   

}

module.exports = authAdmin