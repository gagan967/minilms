const express = require('express');
const { Course, Enrollment, Assignment, Submission, User } = require('../models');
const { auth } = require('../middleware/auth');
const { rbac } = require('../middleware/rbac');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/student', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Course, include: [{ model: Assignment }] }],
    });
    const submissions = await Submission.findAll({
      where: { userId: req.user.id },
      include: [{ model: Assignment, include: [Course] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ enrolledCourses: enrollments, submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/instructor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const where = req.user.role === 'admin' ? {} : { instructorId: req.user.id };
    const courses = await Course.findAll({
      where,
      include: [
        { model: User, as: 'Instructor', attributes: ['id', 'name', 'email'] },
        { model: Assignment },
      ],
    });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const [userCount, courseCount] = await Promise.all([
      User.count(),
      Course.count(),
    ]);
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    const courses = await Course.findAll({
      include: [{ model: User, as: 'Instructor', attributes: ['id', 'name', 'email'] }],
    });
    res.json({ userCount, courseCount, users, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/enrolled-courses', auth, rbac('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Course, include: [{ model: Assignment }] }],
    });
    res.json(enrollments.map((e) => e.Course));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
