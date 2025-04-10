import express from 'express'
const router = express.Router()
import userRegisterController from '../controllers/userController.js'

    
router.get("/", userRegisterController)

export default router