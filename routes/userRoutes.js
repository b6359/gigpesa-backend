const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { submitTask, getTasks, submissionHistory } = require("../controllers/taskController");
const { getReferrals } = require("../controllers/referralController");
const { createWithdraw, getWithdraws } = require("../controllers/withdrawalController");
const { createNotification, getNotification, deleteNotification } = require("../controllers/notificationController");
const upload = require("../middleware/multer");

router.get("/dashboard/summary", authMiddleware, userController.dashboardSummary);
router.get("/profile", authMiddleware, userController.userProfile);

router.get("/tasks", authMiddleware, getTasks);
router.post("/task/submit", authMiddleware, upload.single('proof'), submitTask);
router.get("/tasks/history", authMiddleware, submissionHistory);

router.get("/referrals", authMiddleware, getReferrals);

router.post("/withdraw", authMiddleware, createWithdraw);
router.get("/withdrawals", authMiddleware, getWithdraws);

router.post('/notification', authMiddleware, createNotification);
router.get('/notifications', authMiddleware, getNotification);
router.delete('/notification', authMiddleware, deleteNotification);

module.exports = router;
