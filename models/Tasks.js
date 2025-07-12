const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define("Task", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    offer_url: { type: DataTypes.STRING, defaultValue: null },
    expiration_date: { type: DataTypes.DATEONLY, defaultValue: Date.now() },
    country_codes: { type: DataTypes.STRING, defaultValue: null },
    category: { type: DataTypes.STRING, defaultValue: null },
    default_payout: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    device_type: { type: DataTypes.STRING, defaultValue: null },
    status: { type: DataTypes.STRING, defaultValue: null },
}, {
    tableName: 'tasks',
    timestamps: true,
});

module.exports = Task;