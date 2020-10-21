const mongoose = require('mongoose');
const auth = require('./auth.js');
const Class = require('./model/Class.js')




const authAdmin = async (req,res,next) => {

    try {
        const user = req.user

        var classId = req.body.classId || req.header("classId");
        // JSON.stringify(classId)
        const getClass = await Class.findOne({ _id : classId, 'admins.admin' : user._id})
        if(!getClass)
            return res.status(404).send({error:'Only admin can use this operation'})
        req.user.myClass = getClass
        
        next()

    } catch (error) {
        console.log(error)
        res.status(404).send({error})
    }

   

}

module.exports = authAdmin