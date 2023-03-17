import { } from 'dotenv/config'
import express from 'express'
import { userRouter, blogRouter, commentRouter, adminRouter, likeRouter } from './routes/index.js'
import connectDB from './db/connectDb.js'
const app = express()

app.use(express.json())

const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

//Database Connection
connectDB(DATABASE_URL)

//Load Routes
app.use("/", userRouter, blogRouter, commentRouter, adminRouter, likeRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})