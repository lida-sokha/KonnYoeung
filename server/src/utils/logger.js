const RecentActivity = require('../models/RecentActivity');
exports.logUserActivity = async (userId, action, title, entityId = null) => {
  try {
    await RecentActivity.create({
      user: userId,
      actionType: action,
      metadata: { title, entityId }
    });
  } catch (err) {
    console.error("RecentActivity Log Error:", err);
  }
};