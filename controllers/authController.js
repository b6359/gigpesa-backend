const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");
const JWT_SECRET = process.env.JWT_SECRET;
const { sendWelcomeEmail, sendResetEmail } = require("../emailService");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const Referrals = require("../models/Referrals");
exports.register = async (req, res) => {
  const { name, username, email, password, dob, gender, country, securityAnswer, referral } = req.body;
  if (!name || !username || !email || !password || !dob || !gender || !country || !securityAnswer) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob) || isNaN(new Date(dob).getTime())) {
    return res.status(400).json({ message: "Invalid Date of Birth format. Use YYYY-MM-DD." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  try {
    const exists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (exists) {
      return res.status(409).json({ message: "Email or Username already exists." });
    }

    let referrer_user;
    if (referral) {
      referrer_user = await User.findByPk(referral);
      if (!referrer_user) {
        return res.status(404).json({ message: `Referral user is not found!` });
      }
    }

    let profileImage;
    if (req.file) {
      profileImage = req.file.filename;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      dob,
      gender,
      country,
      securityAnswer,
      profileImage,
    });

    if (referral) {
      await Referrals.create({
        referrer_id: referrer_user.id,
        referred_user_id: user.id,
        earning: 1,
        level: "Register"
      });

      await Notification.create(
        {
          user_id: referrer_user.id,
          message: `New user registered using your referral link.`,
          type: "Pop-Up",
          visibility: "top",
          isRead: false
        }
      );
    };

    await sendWelcomeEmail(email, name);

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        country: user.country,
        gender: user.gender,
        profileImage: user.profileImage
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed. Try again later." });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: `Welcome back ${user.name}`,
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;
    if (!email || !securityAnswer) {
      return res.status(400).json({ message: "Email and security answer are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    if (user.securityAnswer !== securityAnswer) {
      return res.status(403).json({
        message:
          "Security answer is case-sensitive — remember exactly how you typed it during registration.",
      });
    }

    const token = jwt.sign(
      { email: user.email, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    user.reset_token = token;
    await user.save();

    await sendResetEmail(user.email, user.name || "there", token);
    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user || user.reset_token !== token) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.reset_token = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ message: "Reset link expired or invalid." });
  }
};


exports.getJobs = async (req, res) => {
  const results = [];
  const csvPath = path.join(__dirname, "../JOBS STORE", "jobs.csv");

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json({ jobs: results });
    })
    .on("error", (err) => {
      console.error("CSV Read Error:", err);
      res.status(500).json({ message: "Failed to read jobs file" });
    });
};

exports.profileUpdate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, gender, country, dob } = req.body;

    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `User is not found!` });
    }

    const updateData = { name, gender, country, dob };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    await User.update(updateData,
      { where: { id: user.id } },
    );

    const updatedUser = await User.findByPk(user.id)

    return res.status(200).json({
      message: `Profile was updated successfully.`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile Update Error: ", error);
    return res.status(500).json({ message: `Failed to update your profile!` });
  }
}