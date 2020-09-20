const express = require('express')
const app = express()
// const path = require('path')
const userRouter = require('./src/routers/userRouter.js')
const classRouter = require('./src/routers/classRouter.js')
const fileRouter = require('./src/routers/fileRouter.js')
const downloadRouter = require('./src/routers/downloadRouter.js')
const deleteRouter = require('./src/routers/deleteFile.js')
require("./src/db/mongoose.js")


const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use(userRouter)
app.use(classRouter)
app.use(fileRouter)
app.use(downloadRouter)
app.use(deleteRouter)







app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
})