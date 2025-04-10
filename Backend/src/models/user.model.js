import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    subscription:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
},{timestamps:true})


const user = mongoose.model("user", userSchema )
export default user