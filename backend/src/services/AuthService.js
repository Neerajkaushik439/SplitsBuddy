const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup=async({name,email,password})=>{
 
        let user=await User.findOne({email});
        if(user){
            throw new Error("User already exists");
        }else{
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);
            const user=await User.create({
                name,
                email,
                password:hashedPassword,
                authProvider: "local",

            });
            const token = jwt.sign(
              {
                userId: user._id,
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2h" }
            ); 
            return {
                user,
                token,
              };
    }
}

const login=async({email,password})=>{
        const user=await User.findOne({email});
        if(!user){
            throw new Error("User doesn't exists");
        }else{
            const isMatched=await bcrypt.compare(password,user.password);
            if(isMatched){
                const token = jwt.sign(
                    {
                      userId: user._id,
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2h" }
                  );
                  return {
                    user,
                    token,
                  };
            }else{
                throw new Error("invalid credentials");
            }
        }
    
}

const logout=({name,email,password})=>{
    return true;
}
module.exports={signup,login,logout};