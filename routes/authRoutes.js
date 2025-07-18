const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multer");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many attempts. Please try again later.",
});

router.post("/register", authLimiter, upload.single('profileImage'), authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/jobs", authMiddleware, authController.getJobs);


module.exports = router;
