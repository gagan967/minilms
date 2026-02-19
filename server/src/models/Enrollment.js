const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
}, {
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId', 'courseId'] },
  ],
});

module.exports = Enrollment;
