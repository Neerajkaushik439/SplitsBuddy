const mongoose=require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //jo trigger karrha hai
  type:{
    type: String,
    enum: ['EXPENSE_ADDED', 'EXPENSE_UPDATED', 'DEBT_SETTLED',
          'GROUP_INVITE', 'PAYMENT_RECEIVED', 'REMINDER','FRIEND_REQUEST','FRIEND_REQUEST_ACCEPTED'],
    required: true
  },
  message: { type: String },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  entity:{
    entityId:   { type: mongoose.Schema.Types.ObjectId },
    entityType: { type: String, enum: ['Expense', 'Settlement', 'Group'] }
  },
  isRead:    { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  meta:      { type: Object, default: {} },
}, 
{ timestamps: true}
);
// 🔥 indexes
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
module.exports=mongoose.model("Notification",notificationSchema);