const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskSubmission = sequelize.define("task_submission", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    task_id: { type: DataTypes.STRING, allowNull: false },
    proof: { type: DataTypes.STRING, defaultValue: null },
    status: { type: DataTypes.STRING, allowNull: false },
    earnings: { type: DataTypes.STRING, defaultValue: null },
    submitted_at: { type: DataTypes.DATEONLY, defaultValue: Date.now() },
    device_type: { type: DataTypes.STRING, defaultValue: null },
    document: { type: DataTypes.STRING, defaultValue: null },
}, {
    tableName: 'task_submission',
    timestamps: true
});

module.exports = TaskSubmission;