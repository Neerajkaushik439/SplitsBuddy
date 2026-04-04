const GroupMember=require('../models/GroupMember')
const mongoose=require('mongoose')
const isMember=async(userId,groupId)=>{
    const member=await GroupMember.findOne({userId:userId.toString(),groupId:groupId.toString(),})
    return !!member;
}

const addMember=async(groupId,userId,role='member')=>{
    await GroupMember.create({
        userId: new mongoose.Types.ObjectId(userId),
        groupId: new mongoose.Types.ObjectId(groupId),
        role
    })
}
const getMembers=async(groupId)=>{
    const members=await GroupMember.find({groupId: new mongoose.Types.ObjectId(groupId)}).populate("userId", "name email")
    return members.map(member=>member.userId)
}
module.exports={
    isMember,
    addMember,
    getMembers
}