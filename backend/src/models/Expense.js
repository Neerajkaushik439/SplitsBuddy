const mongoose=require('mongoose')

const ExpenseSchema=new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
      title:{
        type:String,
        default:"",
        required:true
      },

    amount:{
        type:Number,
        required:true,
        default:0,
    },
    split:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        share:{
            type:Number,
            required:true,
            min:0,
        }
    }],
},{timestamps:true})

module.exports=mongoose.model("Expense",ExpenseSchema)