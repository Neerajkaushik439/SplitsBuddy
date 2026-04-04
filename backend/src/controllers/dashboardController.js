const dashboardService=require('../services/DashboardService')

const getDashboard=async(req,res)=>{
    const {userId}=req.user;
    try{
        const data=await dashboardService.getdashboarddata(userId)
        res.status(201).json({success:true,data})
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}   
module.exports={getDashboard};