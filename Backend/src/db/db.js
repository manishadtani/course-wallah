import mongoose from "mongoose";
import config from "../config/config.js";

const connect = () => {
        
mongoose.connect(config.MONGO_URL)
.then(()=>{
    console.log("Database is connected")
})
.catch((err)=>{
    console.log('server side error in db: '+ err)
})

}

export default connect