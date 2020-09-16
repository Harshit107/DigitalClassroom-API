const express = require('express')
const app = express()
// const path = require('path')
const userRouter = require('./src/routers/userRouter.js')
const classRouter = require('./src/routers/classRouter.js')

require("./src/db/mongoose.js")


const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use(userRouter)
app.use(classRouter)







app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
})