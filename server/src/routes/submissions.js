const express = require('express');
const { Submission, Assignment, Course, Enrollment, User } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');
const { activityLogger } = require('../middleware/activityLog');

const router = express.Router();

const isEnrolled = async (userId, courseId) => {
  const e = await Enrollment.findOne({ where: { userId, courseId } });
  return !!e;
};

router.post('/', auth, rbac('student'), activityLogger('SUBMIT_ASSIGNMENT'), async (req, res) => {
  try {
    const { content, assignmentId } = req.body;
    if (!content || !assignmentId) {
      return res.status(400).json({ error: 'Content and assignmentId are required.' });
    }
    const assignment = await Assignment.findByPk(assignmentId, { include: [Course] });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    const enrolled = await isEnrolled(req.user.id, assignment.courseId);
    if (!enrolled) {
      return res.status(403).json({ error: 'You must be enrolled in the course to submit.' });
    }
    const [submission, created] = await Submission.findOrCreate({
      where: { assignmentId, userId: req.user.id },
      defaults: { content, assignmentId, userId: req.user.id },
    });
    if (!created) {
      await submission.update({ content });
    }
    const sub = await Submission.findByPk(submission.id, {
      include: [{ model: Assignment, include: [Course] }, { model: User, as: 'User', attributes: ['id', 'name', 'email'] }],
    });
    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/assignment/:assignmentId', auth, async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { assignmentId: req.params.assignmentId },
      include: [{ model: User, as: 'User', attributes: ['id', 'name', 'email'] }],
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my', auth, rbac('student'), async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { userId: req.user.id },
      include: [{ model: Assignment, include: [Course] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
