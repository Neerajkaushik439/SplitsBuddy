const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
    },
    authProvider:{
        type:String,
        enum:['google','local'],
        default:'local',
    },
    

    password:{
        type:String,
        required:function(){
            return this.authProvider === "local";
          },
    },
    googleId:{
        type: String,
        default: null,
      },
      isActive:{
        type: Boolean,
        default: true,
      },
},{timestamps:true,})

module.exports=mongoose.model("User",UserSchema);