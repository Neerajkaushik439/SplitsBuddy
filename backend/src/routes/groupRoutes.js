const express=require('express')
const router=express.Router()
const {createGroup,getAllGroups}=require('../controllers/groupController');
const { authmiddleware } = require('../Middlewares/authMiddle');
const { settleUp } = require('../controllers/settlementController');    


router.post('/createGroup',authmiddleware,createGroup);
router.get('/getallGroups',authmiddleware,getAllGroups);
router.post('/settlement',authmiddleware,settleUp);

module.exports=router;
