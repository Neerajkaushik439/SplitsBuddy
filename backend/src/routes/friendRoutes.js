const express=require('express')
const router=express.Router()
const {sendFriendRequest,getallfriends,getPendingRequests,acceptFriendRequest,
    resendInvite,
    addFriendByEmail,removeFriend}=require('../controllers/friendController')
const {authmiddleware}=require('../Middlewares/authMiddle')

router.post('/friendrequest',authmiddleware,sendFriendRequest)
router.post('/addfriendbyemail',authmiddleware,addFriendByEmail)
router.post('/resendfriendrequest/:friendId',authmiddleware,resendInvite)
router.get('/getallfriends',authmiddleware,getallfriends)
router.get('/pendingrequests',authmiddleware,getPendingRequests)
router.put('/acceptfriendrequest/:id',authmiddleware,acceptFriendRequest)
router.delete('/removefriend/:friendId',authmiddleware,removeFriend)

module.exports = router;
