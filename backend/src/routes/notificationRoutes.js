const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authmiddleware } = require('../Middlewares/authMiddle');


router.post('/', authmiddleware, notificationController.createNotification);
router.get('/', authmiddleware, notificationController.getUserNotifications);
router.put('/read-all', authmiddleware, notificationController.markAllAsRead);
router.put('/:id/read', authmiddleware, notificationController.markAsRead);

module.exports = router;

