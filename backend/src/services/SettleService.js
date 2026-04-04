const GroupMember = require("../models/GroupMember");
const Settlement = require("../models/Settlement");


const getSettlementPreview = async (groupId) => {
  const members = await GroupMember.find({ groupId })
    .populate("userId", "name email")
    .lean();

  if (!members || members.length === 0) {
    return [];
  }

  const creditors = [];
  const debtors = [];

  for (const m of members) {
    if (m.balance > 0) {
      creditors.push({
        userId: m.userId._id,
        name: m.userId.name,
        remaining: m.balance,
      });
    } else if (m.balance < 0) {
      debtors.push({
        userId: m.userId._id,
        name: m.userId.name,
        remaining: Math.abs(m.balance),
      });
    }
  }

  const settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.remaining, creditor.remaining);

    settlements.push({
      from: {
        userId: debtor.userId,
        name: debtor.name,
      },
      to: {
        userId: creditor.userId,
        name: creditor.name,
      },
      amount,
    });

    debtor.remaining -= amount;
    creditor.remaining -= amount;

    if (debtor.remaining === 0) i++;
    if (creditor.remaining === 0) j++;
  }

  return settlements;
};
const settleUp=async({
  groupId,
  fromUserId,
  toUserId,
  amount,
  createdBy,
}) => {
  if (amount <= 0) {
    throw new Error("Invalid settlement amount");
  }
  const fromMember = await GroupMember.findOne({
    groupId,
    userId: fromUserId,
  });

  const toMember = await GroupMember.findOne({
    groupId,
    userId: toUserId,
  });

  if (!fromMember || !toMember) {
    throw new Error("Users must be members of the group");
  }

  if (fromMember.balance >= 0) {
    throw new Error("From user does not owe money");
  }

  if (toMember.balance <= 0) {
    throw new Error("To user is not owed money");
  }

  if (amount > Math.abs(fromMember.balance)) {
    throw new Error("Amount exceeds owed balance");
  }

  if (amount > toMember.balance) {
    throw new Error("Amount exceeds receivable balance");
  }

  fromMember.balance += amount;
  toMember.balance -= amount;

  await fromMember.save();
  await toMember.save();

  const settlement = await Settlement.create({
    groupId,
    fromUserId,
    toUserId,
    amount,
    createdBy,
  });

  return settlement;
}
module.exports = {
  getSettlementPreview,
  settleUp,
};
