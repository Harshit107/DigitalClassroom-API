const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Enter Valid Email-ID")
        }
    },
    phone : {
        type:String
    },
    isVerified : {
        type : Boolean,
        default:true
    },
    emailToken : {
        type:String
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    image :{
        type:Buffer
    },
    tokens: [{
        token: {
            required: true,
            type: String
        }
    }]

},{
    timestamps :true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens
    return userObject
}

userSchema.virtual('students', {
    ref : 'Class',
    localField : '_id',
    foreignField : 'students.student'
})
userSchema.virtual('admins', {
    ref : 'Class',
    localField : '_id',
    foreignField : 'admins.admin'
})
userSchema.virtual('classes', {
    ref: 'Class',
    localField: "_id",
    foreignField: 'users.member'
})
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})

userSchema.statics.findByCredentails = async (email, password) => {

    const user = await User.findOne({
        "email": email
    })

    if (!user)
        throw new Error('No Email Found');

    const checkPassworMatch = await bcrypt.compare(password, user.password)
    if (!checkPassworMatch) {
        throw new Error('Invalid Password')
    }
    console.log(checkPassworMatch)
    return user
}



userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT)
    user.tokens = user.tokens.concat({
        token
    })

    await user.save()
    return token

}
userSchema.pre('save',async function(next){
    const user = this;
    //console.log("At Pre Position")

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
        console.log('Yes Changed')
    }


    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User