const express = require('express');
const { User } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');
const { activityLogger } = require('../middleware/activityLog');

const router = express.Router();

router.get('/', auth, rbac('admin'), activityLogger('LIST_USERS'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
