import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
        userId:{
            type:String,
            required:true,
        },
         friendId:{
            type:String,
            required:true,
        },
         status:{
            type:String,
            required:true,
        },
         createdAt:{
            type:String,
            required:true,
            unique:true,
        }

        },
    {timestamps:true}

);

const Contact=mongoose.model("User",contactSchema);

export default Contact;
