import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../config/config.js";


const userRegisterController = async (req,res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name) {
            return res.status(400).json({ message: "username is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "password is required" });
        }

        const isUser = await userModel.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        });

        if (isUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'   // ✅ Add this line
        });

        const otp = Math.floor(Math.random()*1000000)

        const token = jwt.sign({ userId: user._id, email: user.email, otp:otp }, config.SECRET_KEY, {expiresIn:"1h"});
        const data = {name, otp}
        res.json({ token: token, user: user });

    } catch (err) {
        res.status(500).json({message:err.message})
    }
} 


export default userRegisterController



