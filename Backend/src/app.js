import express from 'express'
const app = express()
import userRoutes from './routers/auth.route.js'
import cors from 'cors'



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Your frontend URL (Vite default) or '*' for testing
    credentials: true // If you need to send cookies/auth headers
}));


    
app.use("/api/v1/auth", userRoutes)

export default app