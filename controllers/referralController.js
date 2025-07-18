const Referrals = require("../models/Referrals");
const User = require("../models/User");
exports.getReferrals = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { start = 0, limit = 10 } = req.query;

        start = parseInt(start);
        limit = parseInt(limit);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        const { count, rows: referrals } = await Referrals.findAndCountAll({
            where: { referrer_id: userId },
            offset: start,
            limit,
            include: [
                {
                    model: User,
                    as: 'referredUser',
                    attributes: ['username', 'name', 'email']
                }
            ]
        });

        return res.status(200).json({
            message: `Referrals fetched successfully!`,
            count,
            start,
            limit,
            referrals
        });
    } catch (error) {
        console.log(`Get Referrals error: ${error}`);
        return res.status(500).json({ message: `Failed to get referrals!` });
    }
};