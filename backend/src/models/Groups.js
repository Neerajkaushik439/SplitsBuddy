const mongoose=require('mongoose');

const GroupsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",
        required:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
});

module.exports=mongoose.model("Group",GroupsSchema);