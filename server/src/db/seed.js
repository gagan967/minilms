require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Course, Assignment, Enrollment, Submission } = require('../models');

async function seed() {
  try {
    console.log('Seeding database...');

    // Create users
    const hashedPassword = await bcrypt.hash('pass123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = await User.bulkCreate([
      { name: 'Admin User', email: 'admin@lms.com', password: adminPassword, role: 'admin' },
      { name: 'John Doe', email: 'instructor1@lms.com', password: hashedPassword, role: 'instructor' },
      { name: 'Jane Smith', email: 'instructor2@lms.com', password: hashedPassword, role: 'instructor' },
      { name: 'Alice Johnson', email: 'student1@lms.com', password: hashedPassword, role: 'student' },
      { name: 'Bob Wilson', email: 'student2@lms.com', password: hashedPassword, role: 'student' },
      { name: 'Carol Brown', email: 'student3@lms.com', password: hashedPassword, role: 'student' },
    ]);

    console.log('Users created');

    // Create courses
    const courses = await Course.bulkCreate([
      { title: 'Introduction to React', description: 'Learn the basics of React.js', instructorId: users[1].id },
      { title: 'Advanced Node.js', description: 'Deep dive into Node.js backend development', instructorId: users[2].id },
      { title: 'Database Design', description: 'Fundamentals of database design and SQL', instructorId: users[1].id },
    ]);

    console.log('Courses created');

    // Create assignments
    const assignments = await Assignment.bulkCreate([
      { title: 'Build a Todo App', description: 'Create a simple todo application using React', dueDate: new Date('2026-03-01'), courseId: courses[0].id },
      { title: 'REST API Project', description: 'Build a REST API with authentication', dueDate: new Date('2026-03-15'), courseId: courses[1].id },
      { title: 'Database Schema Design', description: 'Design a database schema for a blog application', dueDate: new Date('2026-03-10'), courseId: courses[2].id },
      { title: 'React Hooks Exercise', description: 'Practice using React hooks in a component', dueDate: new Date('2026-03-05'), courseId: courses[0].id },
    ]);

    console.log('Assignments created');

    // Enroll students
    await Enrollment.bulkCreate([
      { userId: users[3].id, courseId: courses[0].id },
      { userId: users[3].id, courseId: courses[1].id },
      { userId: users[4].id, courseId: courses[1].id },
      { userId: users[4].id, courseId: courses[2].id },
      { userId: users[5].id, courseId: courses[0].id },
      { userId: users[5].id, courseId: courses[2].id },
    ]);

    console.log('Enrollments created');

    // Create submissions
    await Submission.bulkCreate([
      { userId: users[3].id, assignmentId: assignments[0].id, content: 'Here is my todo app submission...' },
      { userId: users[4].id, assignmentId: assignments[1].id, content: 'My REST API implementation...' },
      { userId: users[5].id, assignmentId: assignments[2].id, content: 'Database schema design document...' },
    ]);

    console.log('Submissions created');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seed();