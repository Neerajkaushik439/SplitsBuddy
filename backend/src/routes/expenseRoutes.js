const express = require('express');
const router = express.Router();
const {authmiddleware} =require('../Middlewares/authMiddle')
const {addExpense,getallGroupExpenses,deleteExpense}=require('../controllers/expenseController')

router.post('/expense',authmiddleware,addExpense)
router.get('/:groupId/getallgroupexpenses',authmiddleware,getallGroupExpenses)
router.delete('/deleteexpense/:expenseId',authmiddleware,deleteExpense)
module.exports=router;
