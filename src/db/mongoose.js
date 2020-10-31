const mongoose = require('mongoose')
require('dotenv').config()


//connecting to mongoDB using mongoose
mongoose.connect(process.env.MONGODB_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
})

// Creating a constructor for the for the User ----------- Basically it decide the parameter of users

// const user = new User({
//     name : 'harshit',
//     age : 10,
//     email : "h@gmail.com",
//     password : "password"
// })s
// const Task = mongoose.model('Task',{
//     //defining the parameter
//     description : {
//         type : String
//     },
//     completed : {
//         type : Boolean
//     }
// })

//creating a instance of type
// const task = new Task({
//     description : 'Learning The Mongoose Library',
//     completed : true
// })

//sending datatype **promise return
// user.save().then((msg)=>console.log(msg)).catch((err)=>{console.log(err)})

