const mongoose = require("mongoose");
const groupMembers = require("../models/GroupMember");

const getdashboarddata = async (userId) => {
  try {
    // 1️⃣ Pehle user ke groups nikalo
    const userMemberships = await groupMembers
      .find({ userId })
      .select("groupId")
      .lean();

    const groupIds = userMemberships.map((m) => m.groupId);

    if (groupIds.length === 0) {
      return {
        totalYouOwe: 0,
        totalYouAreOwed: 0,
        groups: [],
      };
    }

    // 2️⃣ In groups ke saare members lao
    const memberships = await groupMembers
      .find({ groupId: { $in: groupIds } })
      .populate({
        path: "groupId",
        select: "name description createdBy",
        populate: {
          path: "createdBy",
          select: "name",
        },
      })
      .populate("userId", "name")
      .lean();

    let totalYouOwe = 0;
    let totalYouAreOwed = 0;

    const groupMap = {};

    // 3️⃣ Aggregate data
    memberships.forEach((m) => {
      const gid = m.groupId._id.toString();
      const balance = m.balance || 0;

      if (!groupMap[gid]) {
        groupMap[gid] = {
          groupId: m.groupId._id,
          groupName: m.groupId.name,
          description: m.groupId.description,
          membersPreview: [],
          membersCount: 0,
          balance: 0,
        };

        // ✅ Admin ko member ke roop me add karo
        if (m.groupId.createdBy) {
          groupMap[gid].membersPreview.push({
            _id: m.groupId.createdBy._id,
            name: m.groupId.createdBy.name,
          });
          groupMap[gid].membersCount += 1;
        }
      }

      // ✅ Balance sirf current user ka
      if (m.userId && m.userId._id.toString() === userId.toString()) {
        if (balance < 0) totalYouOwe += Math.abs(balance);
        else if (balance > 0) totalYouAreOwed += balance;

        groupMap[gid].balance += balance;
      }

      // ✅ Har member add karo (duplicate avoid)
      if (
        m.userId &&
        !groupMap[gid].membersPreview.some(
          (u) => u._id.toString() === m.userId._id.toString()
        )
      ) {
        groupMap[gid].membersPreview.push({
          _id: m.userId._id,
          name: m.userId.name,
        });
        groupMap[gid].membersCount += 1;
      }
    });

    // 4️⃣ Final response
    return {
      totalYouOwe,
      totalYouAreOwed,
      groups: Object.values(groupMap),
    };
  } catch (err) {
    console.error("Dashboard error:", err);
    throw new Error(err.message);
  }
};

module.exports = { getdashboarddata };
