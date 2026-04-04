const mongoose=require('mongoose');

const GroupMemberSchema=new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    role:{
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      balance:{type:Number,
        default:0},
});
GroupMemberSchema.index({ userId: 1, groupId: 1 }, { unique: true });
module.exports=mongoose.model("groupMembers",GroupMemberSchema);