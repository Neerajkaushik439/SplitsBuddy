const groupService=require('../services/GroupService')

const createGroup=async(req,res)=>{
    try{
        const {userId}=req.user;
        const {name,description,members}=req.body;
        if (!name) {
            return res.status(400).json({
              message: "Group name is required",
            });
          }
        const group = await groupService.createGroup(userId,{
            name,
            description,
            members: members || [],

        })
        console.log('Group created:',members);
        res.status(201).json({
            group,  
            message:'group created successfully'

        })
    }catch(err){
        console.log('Error while creating a new group',err.message);
        return res.status(500).send({message: err.message})
    }
}

const getAllGroups= async (req,res)=>{
    try{
        const {userId}=req.user;
        const groups=await groupService.getAllGroups(userId)
        res.status(200).json({
            groups,
            message:"groups fetched successfully",
        })
    }
    catch(err){
        console.log("error while getting all the groups",err.message);
        return res.status(500).send({message: err.message});
    }
}

module.exports={
    createGroup,
    getAllGroups,
}