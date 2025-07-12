const Referrals = require("../models/Referrals");
const User = require("../models/User");

exports.dashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const user = await User.findByPk(userId, {
      attributes: ["total_earnings", "pending_payments", "id"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const referralCount = await Referrals.count({
      where: { referrer_id: user.id }
    });

    res.json({
      availableEarnings: user.total_earnings || 0,
      pendingEarnings: user.pending_payments || 0,
      referralCount,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};
exports.userProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("User profile error:", err);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};