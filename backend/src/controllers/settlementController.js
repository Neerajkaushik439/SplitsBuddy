const settlementService=require('../services/SettleService')
const groupMember=require('../models/GroupMember')
const mongoose=require('mongoose')

const getSettlementPreview=async(req,res)=>{
    const {userId}=req.user
    
    const groupId=new mongoose.Types.ObjectId(req.params.groupId);
    console.log("user",userId,groupId);
    try{
        const member=await groupMember.findOne({userId,groupId})
        
        if(!member) throw new Error("You are not a part of this group")
        const result = await settlementService.getSettlementPreview(groupId)
        res.status(201).json({result,message:"Success for getting settlement preview"})
    }catch(err){
        console.log('Error in getting settlement preview',err.message)
        return res.status(500).json({error: err.message})
    }
}
const settleUp = async (req, res) => {
    try {
      const {userId}= req.user;
      const createdBy=userId;
      const { groupId, fromUserId, toUserId, amount } = req.body;
  
      const isMember = await groupMember.findOne({
        groupId,
        userId: createdBy,
      });
  
      if (!isMember) {
        return res.status(403).json({
          message: "You are not a member of this group",
        });
      }
      const settlement = await settlementService.settleUp({
        groupId,
        fromUserId,
        toUserId,
        amount,
        createdBy,
      });
     await Promise.all([
  createNotification({
    userId: toUserId,
    senderId: fromUserId,
    type: "PAYMENT_RECEIVED",
    message: `${req.user.name} paid you ₹${amount}`,
    groupId,
    meta: { settlementId: settlement._id },
  }),

  createNotification({
    userId: fromUserId,
    senderId: fromUserId,
    type: "DEBT_SETTLED",
    message: `You paid ₹${amount}`,
    groupId,
    meta: { settlementId: settlement._id },
  })
]);
      return res.status(201).json({
        message: "Settlement successful",
        settlement,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

module.exports={getSettlementPreview,settleUp}
