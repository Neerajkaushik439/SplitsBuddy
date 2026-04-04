const mongoose=require('mongoose')

const SettlementSchema=new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true,
    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    amount:{
        type:Number,
        min:0,
        required:true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
},{timestamps:true})

module.exports=mongoose.model("Settlement",SettlementSchema);