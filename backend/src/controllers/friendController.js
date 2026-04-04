const { count } = require('console');
const friendService=require('../services/FriendService')
const { resendfriendreq } = require("../services/FriendService");

const sendFriendRequest=async(req,res)=>{
    const {toUserId}=req.body;
    const fromUserId=req.user.userId;
    console.log(fromUserId,toUserId);
    
    try{
        const request=await friendService.sendFriendRequest({fromUserId,toUserId});
        await createNotification({
      userId: toUserId,
      senderId: fromUserId,
      type: "FRIEND_REQUEST",
      message: `${fromUserId} sent you a friend request`,
      meta: { requestId: request._id },
    });

        res.status(201).json({message:"friend request sent",request})

    }catch(err){
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

const addFriendByEmail = async (req, res) => {

  try {
    const { email } = req.body;
    const { userId } = req.user; // auth middleware se aata hai

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await friendService.addFriendByEmail(userId, email);

    res.status(201).json(result);
  } catch (err) {
    console.error("ADD FRIEND ERROR 👉", err);
    res.status(400).json({
      
      message: err.message,
    });
  }
};


const acceptFriendRequest=async(req,res)=>{
    const {id}=req.params;
    const {userId}=req.user;
    try{
       const req= await friendService.acceptFriendRequest(id,userId);
       await createNotification({
      userId: req.fromUserId,
      senderId: userId,
      type: "FRIEND_REQUEST_ACCEPTED",
      message: `${userId} accepted your friend request`,
      meta: { requestId: req._id },
    });
    
        res.status(201).json({message:"friend request accepted",req})
    }catch(err){
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

const getallfriends=async(req,res)=>{
    const {userId}=req.user
    try{
        const friends=await friendService.getallfriends(userId);
        res.status(201).json({
            friends,
            count:friends.length,
            message:'All Friends'
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

const getPendingRequests=async(req,res)=>{
    const {userId}=req.user;
    try{
        const {incoming,sent}=await friendService.getPendingRequests(userId);
        res.status(201).json({
            incoming,
            sent,
            count:incoming.length+sent.length,
            message:'All Pending Requests'
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

const resendInvite = async (req, res) => {
    try {
      const { friendId } = req.params;
      const {userId} = req.user; // auth middleware se
  
      const result = await resendfriendreq(friendId, userId);
  
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const removeFriend=async(req,res)=>{
    try{
        const {friendId}=req.params;
        const {userId}=req.user;
        const result=await friendService.removeFriend(friendId,userId);
        res.status(200).json(result);
    }catch(err){
        res.status(400).json({message:err.message});
    } }

module.exports={sendFriendRequest,
    getallfriends,acceptFriendRequest,
    getPendingRequests,resendInvite,addFriendByEmail,removeFriend}