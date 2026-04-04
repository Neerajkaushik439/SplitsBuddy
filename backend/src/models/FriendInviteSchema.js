const mongoose = require("mongoose");

const FriendInviteSchema = new mongoose.Schema({
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Friend",
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FriendInvite", FriendInviteSchema);

