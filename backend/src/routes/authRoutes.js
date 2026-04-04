const express=require('express')
const router=express.Router()
const {signup,login,logout,getMe,googleLogin}=require('../controllers/authController')
const {authmiddleware}=require('../Middlewares/authMiddle')

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.post('/google',googleLogin);
router.get('/me',authmiddleware,getMe);

module.exports=router;