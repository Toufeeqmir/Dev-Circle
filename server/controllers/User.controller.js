const User = require("../models/User");

const getProfile = async (req, res) =>{
    try{
 const user =  await User.findOne({username: req.params.username}).select("-password");

    if(!user){
        return res.status(404).json({message: "User not found"});

    }
     res.status(200).json({success: true, user});
    }
    catch(error){
        res.status(500).json({messasge:"Failed to find the user", error: error.message});
    }
   
}

const updateProfile = async (req, res) =>{
    const{bio , avatar} = req.body;
     try{
      const updatedUser =   await User.findByIdAndUpdate(req.user._id, {bio, avatar}, {new: true}).select("-password");
        return res.status(200).json({success: true, user: updatedUser , message: "updated user"})
     }
     catch(error){
        res.status(500).json({message : "not updated"});
     }

}

module.exports = {
    getProfile,
    updateProfile
}