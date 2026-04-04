const GroupmemberService=require('../services/GroupmemberService')
const friendService = require("../services/FriendService");
const notificationService = require('../services/NotificationService');
const User = require('../models/User');
const Groups = require('../models/Groups');

const addFriendtogroup=async(req,res)=>{
    const {userId}=req.user;
    const {groupId,frienduserId}=req.body;
    try{
        if(!groupId||!frienduserId){
            return res.status(400).json({
                message: "groupId and friendUserId required",
              });
            }
        const ismember=await GroupmemberService.isMember(userId,groupId);
        if(!ismember){
           return res.status(403).json({
                message:"you are not a member of this group"});
        }
        if(userId === frienduserId) {
            return res.status(400).json({
              message: "You are already in the group",
            });
          }
        const isfriend=await friendService.areFriends(userId,frienduserId);
        if(!isfriend){
            return res.status(400).json({
                message:"user is not your friend"
            })
        }
        const isalreadyadded=await GroupmemberService.isMember(frienduserId,groupId);
        if(isalreadyadded){
            return res.status(400).json({
                message:"user is already a member of this group"
            })
        }
        await GroupmemberService.addMember(groupId,frienduserId);

        try {
          const adder = await User.findById(userId);
          const group = await Groups.findById(groupId);
          if (adder && group) {
            await notificationService.createNotification({
              userId: frienduserId,
              message: `${adder.username} added you to the group "${group.name}".`,
              groupId,
            });
          }
        } catch (err) {
          console.error("Notification error:", err.message);
        }

        res.status(201).json({message:"friend added to the group"})
    }catch(err){
        console.log("error",err)
        return res.status(500).json({
            message: "something went wrong",
          });
    }
}
const getmembersofgroup=async(req,res)=>{
    const {userId}=req.user;
    const {groupId}=req.params;
    try{
        const isalreadymember=await GroupmemberService.isMember(userId,groupId);
        if(!isalreadymember){
            res.status(403).json({
                message:"you are not a member of this group"});
        }
        if(!groupId){
            return res.status(400).json({
                message: "groupId  required",
              });
            }
        const ismember=await GroupmemberService.isMember(userId,groupId);
        if(!ismember){
            res.status(403).json({
                message:"you are not a member of this group"});
        }
        const members=await GroupmemberService.getMembers(groupId);
        res.status(200).json({
            message:"successfully get all members",
            members});
    }catch(err){
        console.log("error",err)
        return res.status(500).json({
            message: "something went wrong",
          });
    }
}
module.exports={addFriendtogroup,getmembersofgroup}