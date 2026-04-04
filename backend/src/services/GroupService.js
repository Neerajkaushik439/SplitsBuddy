const Group=require('../models/Groups')
const GroupMember=require('../models/GroupMember')

const createGroup=async(userId,{name,description,members})=>{
        if (!name) {
            throw new Error("Group name is required");
          }        
        const group=await Group.create({
            name,
            description,
            createdBy:userId,
        });
        
        // 2️⃣ prepare group members
  const groupMembers = [
    // admin
    {
      groupId: group._id,
      userId,
      role: "admin",
      addedBy: userId,
    },

    // selected friends
    ...members.map(friendId => ({
      groupId: group._id,
      userId: friendId,
      role: "member",
      addedBy: userId,
    })),
  ];
  console.log("group members to be added:", groupMembers);

  // 3️⃣ insert all members
  await GroupMember.insertMany(groupMembers,{ ordered: false });
            return group;

            
}

const getAllGroups=async(userId)=>{
    const memberships=await GroupMember.find({userId}).populate('groupId');
    return memberships.map((membership)=>membership.groupId);
}

module.exports={createGroup,getAllGroups};