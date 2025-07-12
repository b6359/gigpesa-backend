const Notifications = require("../models/Notifications");
const User = require("../models/User");


exports.createNotification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { message, type, visibility } = req.body;

        if (!message || !type || !visibility) {
            return res.status(400).json({ message: `All field must be required!` });
        };

        const user = await User.findByPk(userId);
        if (!user) {
            return res.json({ message: `User is not found!` });
        }

        const notification = await Notifications.create({
            user_id: user.id,
            message,
            type,
            visibility,
            isRead: false,
        });

        return res.status(200).json({
            message: `Notification created successfully!`,
            notification
        });
    } catch (error) {
        console.log(`Create Notification error: ${error}`);
        return res.status(500).json({ message: `Failed to create notification!` });
    }
};

exports.getNotification = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        const notification = await Notifications.findAll({
            where: { user_id: user.id, isRead: false }
        });

        await Notifications.update(
            { isRead: true },
            {
                where: {
                    user_id: user.id,
                    isRead: false,
                }
            }
        );

        return res.status(200).json({
            message: `Notification fetched successfully!`,
            notification
        });
    } catch (error) {
        console.log(`Notification fetching error: ${error}`);
        return res.status(500).json({ message: `Failed to fetching notification!` });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { notification_id } = req.query;

        if (!notification_id) {
            return res.status(400).json({ message: `All field must be required!` });
        };

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        };

        const notification = await Notifications.findByPk(notification_id);
        if (!notification) {
            return res.status(404).json({ message: `Invalid notification id!` });
        };

        await notification.destroy();

        return res.status(200).json({
            message: `Notification delete successfully!`,
            notification
        });
    } catch (error) {
        console.log(`Notification delete error: ${error}`);
        return res.status(500).json({ message: `Failed to delete notification!` });
    }
}