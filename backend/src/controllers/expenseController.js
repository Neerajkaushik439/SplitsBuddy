const expenseService=require('../services/ExpenseService');
const { createNotification } = require('../services/NotificationService');

const addExpense=async(req,res)=>{
    const { userId } = req.user;
    const {
        groupId,
        title,
        amount,
        paidBy,
        split,
    }=req.body;
     console.log("body",req.body);
    try{
       const expense = await expenseService.addExpense({
            groupId,
            title,
            amount,
            paidBy,
            createdBy: userId,
            split,
        });
        //create notification for all the members of the group
        for (const member of split) {
      if (member.userId !== paidBy) {
        await createNotification({
          userId: member.userId,
          senderId: paidBy,
          type: "EXPENSE_ADDED",
          message: `New expense added in group`,
          groupId,
          meta: { amount }
        });
      }
    }
     res.status(201).json({message:"success",expense});

    }catch(err){
        console.log("error",err.message)
        res.status(500).json({message:err.message})
    }
 }
 const deleteExpense=async(req,res)=>{
    const {expenseId}=req.params;
    try{
        await expenseService.deleteExpense(expenseId);
        res.status(200).json({message:"Expense deleted successfully"});
    }catch(err){
        console.log("error",err.message)
        res.status(500).json({message:err.message})
    }
 }
 
 const getallGroupExpenses=async(req,res)=>{
     const {userId}=req.user;
     const {groupId}=req.params;

     try{
         const expenses=await expenseService.getallGroupExpenses(groupId);
         res.status(200).json({expenses,message:"Successfully fetched all the expenses"});
     }catch(err){
         console.log("error",err.message)
         res.status(500).json({message:err.message})
     }
 };
 module.exports={
     addExpense,getallGroupExpenses,deleteExpense
 }
