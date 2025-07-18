const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { submitTask, getTasks, submissionHistory, addTask, deleteTask, getTaskById } = require("../controllers/taskController");
const { getReferrals } = require("../controllers/referralController");
const { createWithdraw, getWithdraws } = require("../controllers/withdrawalController");
const { createNotification, getNotification, deleteNotification } = require("../controllers/notificationController");
const { documentUpload } = require("../middleware/multer");

router.get("/dashboard/summary", authMiddleware, userController.dashboardSummary);
router.get("/profile", authMiddleware, userController.userProfile);

router.post('/task', authMiddleware, addTask);
router.delete('/task', authMiddleware, deleteTask);
router.get("/tasks", authMiddleware, getTasks);
router.post("/task/submit", authMiddleware, documentUpload.single('document'), submitTask);
router.get("/tasks/history", authMiddleware, submissionHistory);
router.get('/task/:task_id', authMiddleware, getTaskById);

router.get("/referrals", authMiddleware, getReferrals);

router.post("/withdraw", authMiddleware, createWithdraw);
router.get("/withdrawals", authMiddleware, getWithdraws);

router.post('/notification', authMiddleware, createNotification);
router.get('/notifications', authMiddleware, getNotification);
router.delete('/notification', authMiddleware, deleteNotification);

module.exports = router;
