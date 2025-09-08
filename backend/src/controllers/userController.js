import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, loginId, bio } = req.body;
    
    // Check if loginId is being changed and if it's already taken
    if (loginId) {
      const existingUser = await User.findOne({ 
        loginId, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ msg: "Login ID already taken" });
      }
    }

    const updateData = { firstName, lastName, loginId, bio };

    // console.log("Uploaded file:", req.file); // Debug file

    if (req.file) {
      try {
        const streamUpload = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "avatars", transformation: [{ width: 300, height: 300, crop: "fill" }] },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            stream.end(fileBuffer);
          });
        };

        const result = await streamUpload(req.file.buffer);
        updateData.profileImage = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }


    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    
    // Handle duplicate key errors (for loginId)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Login ID already exists" });
    }
    
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req,res)=>{
    try{
      const users = await User.find().select("-passowrd");
      res.json(users);

    }
    catch(err){
      res.status(500).json({error:err.message});
    }
};

export const getUserById = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id).select("-passowrd");

    if(!user){
      return res.status(404).json({msg:"User is not found"});
      
    }
    res.json(user)
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
}
