import express from 'express'
const app = express()
import userRoutes from './routers/user.route.js'
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/", userRoutes)

export default app