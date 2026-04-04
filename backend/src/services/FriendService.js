const Friend=require('../models/FriendSchema')
const FriendInvite = require("../models/FriendInviteSchema");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {getFriendRequestEmailTemplate,
  getFriendRequestEmailPlainText,} = require("../utils/emailTemplate");
const notificationService = require("./NotificationService");

const addFriendByEmail = async (fromUserId, email) => {
  // find receiver

  const receiver = await User.findOne({ email });

  if (!receiver) throw new Error("User not found");

  if (fromUserId.toString() === receiver._id.toString()) {
    throw new Error("Cannot add yourself");
  }

  // already exists?
  const exists = await Friend.findOne({
    $or: [
      { requester: fromUserId, receiver: receiver._id },
      { requester: receiver._id, receiver: fromUserId },
    ],
  });
  if (exists) throw new Error("Friend request already exists");

  // 1️⃣ CREATE FRIEND (PENDING)
  const friend = await Friend.create({
    requester: fromUserId,
    receiver: receiver._id,
    status: "pending",
  });

  // 2️⃣ CREATE INVITE
  const token = crypto.randomUUID();
  const invite = await FriendInvite.create({
    friendId: friend._id,
    token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  // 3️⃣ SEND EMAIL
  const link = `${process.env.APP_URL}/add-friend?token=${token}`;

  await sendEmail({
    to: email,
    subject: "You have a friend request 👋",
    html:getFriendRequestEmailTemplate({receiverEmail:email,senderEmail:process.env.EMAIL_FROM,acceptUrl:link}),
    text:getFriendRequestEmailPlainText({recipientEmail:email,senderEmail:process.env.EMAIL_FROM,acceptUrl:link}),
  });

  // 4️⃣ SEND NOTIFICATION
  try {
    const sender = await User.findById(fromUserId);
    if (sender) {
      await notificationService.createNotification({
        userId: receiver._id,
        message: `${sender.username} sent you a friend request.`,
      });
    }
  } catch (err) {
    console.error("Notification error:", err.message);
  }

  return { message: "Invite sent successfully" };
};


const resendfriendreq=async(friendId,userId)=>{
    const friend = await Friend.findById(friendId).populate("receiver");
    if(!friend) throw new Error("freind req not found");
    
    if (friend.requester.toString() !== userId.toString()) {
        throw new Error("Not authorized");
      }

    if (friend.status !== "pending") {
        throw new Error("Friend request is not pending");
      }
      await FriendInvite.updateMany(
        { friendId },
        { used: true }
      );
      const token = crypto.randomUUID();
      await FriendInvite.create({
        friendId,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      await FriendInvite.create({
        friendId,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });

     
      const link = `${process.env.APP_URL}/add-friend?token=${token}`;

      await sendEmail({
        to: friend.receiver.email,
        subject: "Reminder: Friend request 👋",
        html: `
          <p>You still have a pending friend request.</p>
          <a href="${link}">Accept Friend Request</a>
        `,
      });
    
      return { message: "Invite resent successfully" };
    };
    const sendFriendRequest=async({fromUserId,toUserId})=>{

       if(fromUserId===toUserId){
        throw new Error("Cannot send request to yourself");
       }
       const existingFriendship = await Friend.findOne({
        $or: [
            { requester: fromUserId, receiver: toUserId },
            { requester: toUserId, receiver: fromUserId },]
      });
      if (existingFriendship) {
        throw new Error("Friend request already exists");
      }
      const newFriend = await Friend.create({
        requester: fromUserId,
        receiver: toUserId,
      });

      try {
        const sender = await User.findById(fromUserId);
        if (sender) {
          await notificationService.createNotification({
            userId: toUserId,
            message: `${sender.username} sent you a friend request.`,
          });
        }
      } catch (err) {
        console.error("Notification error:", err.message);
      }

      return newFriend;
}

const acceptFriendRequest=async(friendId,receiverId)=>{
    const friendRequest=await Friend.findOne({_id:friendId,receiver:receiverId,status:"pending"});
    console.log(friendRequest);
    if(!friendRequest){throw new Error('No such friend request found');}
    friendRequest.status="accepted";
    await friendRequest.save();

    try {
      const receiver = await User.findById(receiverId);
      if (receiver) {
        await notificationService.createNotification({
          userId: friendRequest.requester,
          message: `${receiver.username} accepted your friend request.`,
        });
      }
    } catch (err) {
      console.error("Notification error:", err.message);
    }

    return friendRequest;
}

const areFriends=async(userId1,userId2)=>{
    const friendship=await Friend.findOne(
        {
            $or:[
                {requester:userId1,receiver:userId2,status:"accepted"},
                {requester:userId2,receiver:userId1,status:"accepted"},
            ]
        }
    );
   return !!friendship;
} 

const getallfriends=async(userId)=>{
    const friends=await Friend.find(
        {status:"accepted",
        $or:[{requester:userId},{receiver:userId}]},
    ).populate({
        path:'requester',
        select:['name','email'],
    }).populate({
        path:'receiver',
        select:['name','email']
    })
    .exec();
    console.log("Friends fetched:", friends);
     return friends.map(friend => {
        if (friend.requester._id.toString() == userId.toString()) {
          return friend.receiver;
        } else {
          return friend.requester;
        }
      }); 
}

const getPendingRequests = async (userId) => {
  // 🔴 Incoming requests (jo mujhe aaye)
  const incoming = await Friend.find({
    receiver: userId,
    status: "pending",
  })
    .populate("requester", "username email")
    .sort({ createdAt: -1 });

  // 🔵 Sent requests (jo maine bheje)
  const sent = await Friend.find({
    requester: userId,
    status: "pending",
  })
    .populate("receiver", "username email")
    .sort({ createdAt: -1 });

  return { incoming, sent };
};

const removeFriend=async(userId1,userId2)=>{
    const friendship=await Friend.findOneAndDelete(
        {
            $or:[
                {requester:userId1,receiver:userId2},
                {requester:userId2,receiver:userId1},
            ]
        }
    );

   try {
     if (friendship) {
       const self = await User.findById(userId1);
       if (self) {
         await notificationService.createNotification({
           userId: userId2,
           message: `${self.username} removed you from their friends.`,
         });
       }
     }
   } catch (err) {
     console.error("Notification error:", err.message);
   }

   return !!friendship;
} 

module.exports={sendFriendRequest,
acceptFriendRequest,areFriends,
getallfriends,getPendingRequests,resendfriendreq,addFriendByEmail,removeFriend};