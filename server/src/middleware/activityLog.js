const { ActivityLog } = require('../models');

const logActivity = async (userId, action, metadata = null) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      timestamp: new Date(),
      metadata,
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

const activityLogger = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
      if (res.statusCode < 400 && req.user) {
        logActivity(req.user.id, action, {
          method: req.method,
          path: req.path,
          ...(body?.id && { resourceId: body.id }),
        }).catch(() => {});
      }
      return originalJson.call(this, body);
    };
    next();
  };
};

module.exports = { logActivity, activityLogger };
