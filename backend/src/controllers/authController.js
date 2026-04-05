
const authService = require('../services/AuthService')
const User = require("../models/User");

 const signup=async(req,res)=>{
    try{
      const {name,password,email}=req.body;
      console.log(req.body);
      if(!email || !password || !name){
          return res.status(422).json({
              error:"Please fill all the fields"
          })
      }
      if (!email.endsWith("@gmail.com")) {
          return res.status(403).json({
              error:"Only @gmail.com emails are allowed"
          })
      }
        const {user,token}=await authService.signup({
        name,password,email});
        return res.status(201).json({
         message:'Signup successfully',
         token,
         user:{
            _id:user._id,
            name:user.name,
            email:user.email
         }
     }); 

    }
    catch(err){
        console.error('signup error:', err);
        if (err.message === 'User already exists') {
          return res.status(409).json({ message: err.message })
        }
        if (err.code === 11000) {
          return res.status(409).json({ message: 'Email already registered' })
        }
        if (err.name === 'ValidationError') {
          const msg = Object.values(err.errors || {})
            .map((e) => e.message)
            .join(' ')
          return res.status(400).json({ message: msg || 'Validation failed' })
        }
        res.status(500).json({
            message: err.message || 'Server error',
        })
    }   
}

 const login=async(req,res)=>{
  try {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({
            error:"please add email or password"
        })
    }
    if (!email.endsWith("@gmail.com")) {
        return res.status(403).json({
            error:"Only @gmail.com emails are allowed"
        })
    }
    const {user,token}=await authService.login({email,password});
    return res.status(200).json({
        message:'Login Successfully',
        token,
        user:{
           _id:user._id,
           name:user.name,
           email:user.email
       }
   });
  }
  catch (error) {
    console.log(error);
    if (error.message === "User doesn't exists" || error.message === 'invalid credentials') {
      return res.status(401).json({ message: error.message })
    }
    res.status(500).json({
        message: error.message || 'Server error',
    })
  }
}

const logout=(req,res)=>{
    res.clearCookie("jwt");
    return res.status(200).json({
        message:"Logout Successfully",
    })
}

const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: "Missing required Google Profile fields" });
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(403).json({ error: "Only @gmail.com emails are allowed" });
    }

    let user = await User.findOne({ email });

    // If user exists and is local, we could link, or if not exists, create
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        authProvider: 'google',
        googleId,
        // password is not required for google auth
      });
    }

    const jwt = require('jsonwebtoken');
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    return res.status(200).json({
      message: 'Google Login Successfully',
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error during Google auth" });
  }
};


const getMe = async (req, res) => {
  try {
    const {userId} = req.user; // authMiddleware se

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports={signup,login,logout,getMe,googleLogin};