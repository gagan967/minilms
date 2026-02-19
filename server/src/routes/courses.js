const express = require('express');
const { Op } = require('sequelize');
const { Course, User, Enrollment, Assignment } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');
const { activityLogger } = require('../middleware/activityLog');

const router = express.Router();

const canCreateCourse = (user) => ['admin', 'instructor'].includes(user.role);

router.get('/', auth, activityLogger('LIST_COURSES'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Course.findAndCountAll({
      include: [{ model: User, as: 'Instructor', attributes: ['id', 'name', 'email'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({ courses: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, rbac('admin', 'instructor'), activityLogger('CREATE_COURSE'), async (req, res) => {
  try {
    if (!canCreateCourse(req.user)) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const { title, description } = req.body;
    const instructorId = req.user.role === 'admin' && req.body.instructorId ? req.body.instructorId : req.user.id;
    const course = await Course.create({ title, description, instructorId });
    const full = await Course.findByPk(course.id, {
      include: [{ model: User, as: 'Instructor', attributes: ['id', 'name', 'email'] }],
    });
    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, activityLogger('VIEW_COURSE'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Instructor', attributes: ['id', 'name', 'email'] },
        { model: Assignment },
      ],
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/enroll', auth, rbac('student'), activityLogger('ENROLL_COURSE'), async (req, res) => {
  try {
    const { Enrollment } = require('../models');
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    const [enrollment] = await Enrollment.findOrCreate({
      where: { userId: req.user.id, courseId: course.id },
      defaults: { userId: req.user.id, courseId: course.id },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, rbac('admin', 'instructor'), activityLogger('DELETE_COURSE'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    await course.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
