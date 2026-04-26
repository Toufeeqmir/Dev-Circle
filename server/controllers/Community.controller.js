const Community= require("../models/Community");
const User = require("../models/User");

//Getting community:   
const getCommunities = async (req, res)=>{
    try{
        const communities = await Community.find().sort({memberCount : -1});
        res.status(200).json({success: true, message: "communities retrieved:",communities});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Create community: 
const createCommunity = async (req, res) =>{
    const {name, description} = req.body;
    try{
        const communityExist = await Community.findOne({name});
        if(communityExist){
            return res.status(400).json({message: "community already exist"});
        }
        const community = await Community.create({name, description, creator: req.user._id, members: [req.user._id], memberCount: 1});
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { communities: community._id }
        });
        res.status(201).json({success: true, message: "community created", community});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};


//Join Community: 
const joinCommunity = async (req, res) =>{
    const {communityId} = req.params;
    try{
        const community = await Community.findById(communityId);
        if(!community){
            res.status(404).json({message:"community not found"});
            return;
        }
        const isMember = community.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if(isMember){
            community.members.pull(req.user._id);
            community.memberCount -= 1;
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { communities: community._id }
            });
        }
        else{
            community.members.push(req.user._id);
            community.memberCount += 1;
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { communities: community._id }
            });
        }
        await community.save();
        res.status(200).json({
            success: true,
            message: isMember ? "community left" : "community joined",
            joined: !isMember,
            memberCount: community.memberCount,
            community
        }); 
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getCommunities,
    createCommunity,
    joinCommunity
}
