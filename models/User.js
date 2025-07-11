const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.ENUM("male", "female"), allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  securityAnswer: { type: DataTypes.STRING, allowNull: false },

  // ✅ NEW FIELDS
  total_earnings: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  pending_payments: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },

}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;
