const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard/summary", authMiddleware, userController.dashboardSummary);
router.get("/profile", authMiddleware, userController.userProfile);

module.exports = router;
