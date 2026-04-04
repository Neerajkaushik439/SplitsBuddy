const express=require('express')
const router=express.Router()
const {getDashboard}=require('../controllers/dashboardController')
const {authmiddleware}=require('../Middlewares/authMiddle')

router.get('/getdash',authmiddleware,getDashboard);
module.exports=router;