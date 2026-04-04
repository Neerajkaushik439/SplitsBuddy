const jwt=require('jsonwebtoken')

const authmiddleware=(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No token provided"});
        }
        const token=req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(403).json({message:'no token found'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(decoded)
        req.user={userId:decoded.userId}
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"expired token"})
    }
}
module.exports={
    authmiddleware,
}
