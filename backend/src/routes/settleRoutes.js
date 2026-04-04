const express=require('express')
const router=express.Router()
const {getSettlementPreview}=require('../controllers/settlementController')
const {authmiddleware}=require('../Middlewares/authMiddle')

router.get('/:groupId/settlement',authmiddleware,getSettlementPreview);

module.exports = router;