const express = require('express');
const { Assignment, Course, Submission, User } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');
const { activityLogger } = require('../middleware/activityLog');

const router = express.Router();

const canCreateAssignment = async (req, courseId) => {
  if (req.user.role === 'admin') return true;
  const course = await Course.findByPk(courseId);
  return course && course.instructorId === req.user.id;
};

router.post('/', auth, rbac('admin', 'instructor'), activityLogger('CREATE_ASSIGNMENT'), async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    if (!title || !dueDate || !courseId) {
      return res.status(400).json({ error: 'Title, dueDate, and courseId are required.' });
    }
    const allowed = await canCreateAssignment(req, courseId);
    if (!allowed) {
      return res.status(403).json({ error: 'Access denied to create assignment for this course.' });
    }
    const assignment = await Assignment.create({ title, description, dueDate, courseId });
    const full = await Assignment.findByPk(assignment.id, { include: [{ model: Course }] });
    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/course/:courseId', auth, activityLogger('LIST_ASSIGNMENTS'), async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { courseId: req.params.courseId },
      include: [{ model: Course }],
      order: [['dueDate', 'ASC']],
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, rbac('admin', 'instructor'), activityLogger('DELETE_ASSIGNMENT'), async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, { include: [{ model: Course }] });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    const allowed = req.user.role === 'admin' || assignment.Course.instructorId === req.user.id;
    if (!allowed) {
      return res.status(403).json({ error: 'Access denied' });
    }
    await assignment.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
