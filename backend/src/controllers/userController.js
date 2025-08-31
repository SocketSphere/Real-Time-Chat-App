import User from "../models/User.js"

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