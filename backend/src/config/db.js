import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB);
        console.log("MongoDB connected");

    }
    catch(error){
        console.error("error connecting to mongoDb", error);
        process.exit(1);
    }
}
