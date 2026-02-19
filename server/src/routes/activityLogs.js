const express = require('express');
const { ActivityLog, User } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');

const router = express.Router();

router.get('/', auth, rbac('admin'), async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['timestamp', 'DESC']],
      limit: 100,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
