const { get } = require('http');
const {authmiddleware} = require('../Middlewares/authMiddle');
const {getallgroups}=require('../controllers/groupController');
const Expense=require("../models/Expense");
const GroupMember=require("../models/GroupMember");
const notificationService=require("./NotificationService");
const addExpense = async ({
    groupId,
    title,
    amount,
    paidBy,
    createdBy,
    split,
  }) => {
  
    if (!groupId || !title || !amount || !paidBy) {
      throw new Error("Please fill all the fields");
    }
  
    if (amount <= 0) {
      throw new Error("Amount should be greater than 0");
    }
  
    if (!split || split.length === 0) {
      throw new Error("Split information cannot be empty");
    }
  
    const splitTotal = split.reduce((acc, item) => acc + item.share, 0);
  
    if (splitTotal !== amount) {
      throw new Error("Split total must be equal to expense amount");
    }
  
    const userIds = split.map(item => item.userId);
  
    // ✅ Correct membership check
    const members = await GroupMember.find({
      userId: { $in: userIds },
      groupId
    });
  
    if (members.length !== userIds.length) {
      throw new Error("All users must be members of this group");
    }
  
    // 🔥 1️⃣ CREDIT PAYER FULL AMOUNT
    await GroupMember.updateOne(
      { groupId, userId: paidBy },
      { $inc: { balance: amount } }
    );
  
    // 🔥 2️⃣ DEBIT EACH SPLIT USER
    for (const s of split) {
      await GroupMember.updateOne(
        { groupId, userId: s.userId },
        { $inc: { balance: -s.share } }
      );
    }
  
    // 3️⃣ SAVE EXPENSE
    const expense = await Expense.create({
      groupId,
      title,
      amount,
      paidBy,
      createdBy,
      split,
    });
  
    // 🔔 SEND NOTIFICATIONS
    try {
      const uId = createdBy.toString();
      const otherMembers = members.filter(m => m.userId.toString() !== uId);
      for (const m of otherMembers) {
        await notificationService.createNotification({
          userId: m.userId,
          message: `A new expense "${title}" of amount ${amount} was added.`,
          groupId,
        });
      }
    } catch (err) {
      console.error("Error sending notifications for expense:", err.message);
    }
  
    return expense;
  };
const getallGroupExpenses=async(groupId)=>{

    const expenses=await Expense.find({groupId}).populate('createdBy','name')
    .populate('paidBy','name')
    .populate('split.userId','name').sort({createdAt:-1});
    return expenses;
    
};
const deleteExpense=async(expenseId)=>{
    const expense=await Expense.findById(expenseId);
    if(!expense){
        throw new Error("Expense not found");
    }
    // if(expense.createdBy.toString()!==userId.toString()){
    //     throw new Error("Only the creator can delete this expense")
    // }
    for(const s of expense.split) {
        let balanceChange = 0;
    
        if (s.userId.toString() === expense.paidBy.toString()) {
            balanceChange -= (expense.amount - s.share);
          }else{
            balanceChange += s.share;
        }
      
    await GroupMember.updateOne(
        { groupId: expense.groupId, userId: s.userId },
        { $inc: { balance: balanceChange } }
        );
    }
    await Expense.findByIdAndDelete(expenseId);

    // 🔔 SEND NOTIFICATIONS
    try {
      const allMembers = await GroupMember.find({ groupId: expense.groupId });
      for (const m of allMembers) {
        await notificationService.createNotification({
          userId: m.userId,
          message: `Expense "${expense.title}" was deleted.`,
          groupId: expense.groupId,
        });
      }
    } catch (err) {
      console.error("Error sending notifications for deleted expense:", err.message);
    }

    return {message:"Expense deleted successfully"};
}
module.exports={
    addExpense,getallGroupExpenses,deleteExpense
};