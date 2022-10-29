const express = require('express')
const app = express()
const userRouter = require('./src/routers/userRouter.js')
const classRouter = require('./src/routers/classRouter.js')
const assignmentRouter = require('./src/routers/assignmentRouter.js')
const developerRouter = require('./src/routers/developerRouter.js')
const attendanceRouter = require('./src/routers/attendanceRouter.js')
const videCallRouter = require('./src/routers/videoCallRouter.js')
const streamRouter = require('./src/routers/streamRouter.js')
const sendMail = require('./src/email/sendMail')
const User = require('./src/model/User')
const path = require('path')
const notificationRouter = require('./src/routers/notificationRouter.js')
require("./src/db/mongoose.js")



const PORT = process.env.PORT || 3000;
app.use(express.json())

// app.use(express.static(__dirname + '/public'));



app.use(userRouter)
app.use(classRouter)
app.use(assignmentRouter)
app.use(developerRouter)
app.use(attendanceRouter)
app.use(streamRouter)
app.use(notificationRouter)
app.use(videCallRouter);

app.get('/checkIsMailWorking', async (req, res) => {
    await sendMail(['harshitkeshari1999@gmail.com','harshituem@gmail.com'])
    res.send('<h1>Done</h1>')
})

app.get('/checkDatabase',async(req, res) => {
    const myUser = await User.findOne( {email : 'harshituem@gmail.com' } )
    console.log(myUser);
    res.send(myUser);
})



//             www.google.com/  
//             localhost:3000/emmanul






app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
})