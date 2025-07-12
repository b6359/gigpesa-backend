const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Withdrawals = sequelize.define('Withdrawal', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, defaultValue: 0.00 },
    method: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    requested_at: { type: DataTypes.DATEONLY, defaultValue: Date.now() },
}, {
    modelName: 'withdrawals',
    timestamps: true
});

Withdrawals.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user', // Alias used in your query include
});

module.exports = Withdrawals;