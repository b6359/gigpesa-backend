const { DataTypes, STRING } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Referrals = sequelize.define('Referrals', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    referrer_id: { type: STRING, allowNull: false },
    referred_user_id: { type: STRING, allowNull: false },
    earning: { type: STRING, allowNull: false },
    level: { type: STRING, allowNull: false }
}, {
    modelName: "referrals",
    timestamps: true,
    indexes: [
        {
            name: 'referrer_id_index',
            fields: ['referrer_id']
        },
        {
            name: 'referred_user_id_index',
            fields: ['referred_user_id']
        }
    ]
});

Referrals.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });
Referrals.belongsTo(User, { foreignKey: 'referred_user_id', as: 'referredUser' });
User.hasMany(Referrals, { foreignKey: 'referrer_id', as: 'referralsMade' });
User.hasMany(Referrals, { foreignKey: 'referred_user_id', as: 'referralsReceived' });

module.exports = Referrals;