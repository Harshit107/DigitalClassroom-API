const express = require('express')
const app = express()
const userRouter = require('./src/routers/userRouter.js')
const classRouter = require('./src/routers/classRouter.js')
const assignmentRouter = require('./src/routers/assignmentRouter.js')
const developerRouter = require('./src/routers/developerRouter.js')
const attendanceRouter = require('./src/routers/attendanceRouter.js')
const streamRouter = require('./src/routers/streamRouter.js')
const notificationRouter = require('./src/routers/notificationRouter.js')
require("./src/db/mongoose.js")


const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use(userRouter)
app.use(classRouter)
app.use(assignmentRouter)
app.use(developerRouter)
app.use(attendanceRouter)
app.use(streamRouter)
app.use(notificationRouter)







app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
})