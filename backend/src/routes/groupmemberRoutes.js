const express=require('express')
const router=express.Router()
const{addFriendtogroup,getmembersofgroup}=require('../controllers/groupmemberController')
const {authmiddleware}=require('../Middlewares/authMiddle')

router.post('/addfriendtogroup',authmiddleware,addFriendtogroup)
router.get('/getmembersofgroup/:groupId',authmiddleware,getmembersofgroup)
module.exports=router

