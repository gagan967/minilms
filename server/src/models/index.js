const { sequelize } = require('../db');
const User = require('./User');
const Course = require('./Course');
const Assignment = require('./Assignment');
const Enrollment = require('./Enrollment');
const Submission = require('./Submission');
const ActivityLog = require('./ActivityLog');

// Associations
User.hasMany(Course, { foreignKey: 'instructorId', as: 'InstructorCourses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'Instructor' });

Course.hasMany(Assignment, { foreignKey: 'courseId' });
Assignment.belongsTo(Course, { foreignKey: 'courseId' });

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });
User.hasMany(Enrollment, { foreignKey: 'userId' });
Course.hasMany(Enrollment, { foreignKey: 'courseId' });

Assignment.hasMany(Submission, { foreignKey: 'assignmentId' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
User.hasMany(Submission, { foreignKey: 'userId' });
Submission.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Course,
  Assignment,
  Enrollment,
  Submission,
  ActivityLog,
};
