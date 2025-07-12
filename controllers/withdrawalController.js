const User = require("../models/User");
const Withdrawals = require("../models/withdrawals");


exports.createWithdraw = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, method, status } = req.body;
        if (!amount || !method || !status) {
            return res.status(400).json({ message: `All fields are required!` });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        if (amount < 0) {
            return res.status(404).json({ message: `Amount can not be negative` });
        };

        const numericAmount = parseInt(amount);
        const currentEarning = parseInt(user.total_earnings);
        if (currentEarning < numericAmount) {
            return res.status(400).json({ message: `Insufficient earnings!` });
        }

        const withdrawData = await Withdrawals.create({
            user_id: user.id,
            amount: numericAmount,
            method,
            status,
            requested_at: new Date()
        });

        user.total_earnings = (currentEarning - numericAmount).toFixed(2);
        await user.save();

        return res.status(200).json({
            message: `Withdraw created successfully!`,
            withdrawData
        });
    } catch (error) {
        console.log(`Create Withdraw Error: ${error}`);
        return res.status(500).json({ message: `Failed to create withdraw!` });
    }
};

exports.getWithdraws = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { start, limit } = req.query;

        start = parseInt(start);
        limit = parseInt(limit);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        const { count, rows: withdrawals } = await Withdrawals.findAndCountAll({
            where: { user_id: user.id },
            offset: start,
            limit,
        });

        return res.status(200).json({
            message: `Withdrawal history fetched successfully!`,
            totalPages: Math.ceil(count/limit),
            start,
            limit,
            withdrawals
        });
    } catch (error) {
        console.log(`Get withdraw error: ${error}`);
        return res.status(500).json({ message: `Failed to fetching withdraws!` });
    }
};

