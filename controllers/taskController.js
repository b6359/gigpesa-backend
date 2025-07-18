const { Op } = require('sequelize');
const Task = require('../models/Tasks');
const TaskSubmission = require('../models/TaskSubmission');
const User = require('../models/User');
const Notifications = require('../models/Notifications');

exports.addTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, description, offer_url, status, expiration_date, country_codes, default_payout, category, device_type, id } = req.body;
        if (!name || !description || !offer_url || !status || !expiration_date || !country_codes || !default_payout || !category || !device_type || !id) {
            return res.status(400).json({ message: `All field must be required!` });
        };

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        };

        const task = await Task.create({
            id,
            name,
            description,
            offer_url,
            expiration_date,
            country_codes,
            category,
            default_payout,
            device_type,
            status,
        });

        return res.status(200).json({
            message: `New Task added successfully!`,
            task
        });
    } catch (error) {
        console.log(`Add task error: ${error}`);
        return res.status(500).json({ message: `Failed to add task!` });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { task_id, isDelete } = req.query;

        if (!task_id) {
            return res.status(400).json({ message: `All field must be required!` });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({ message: `Task is not found!` });
        }

        if (isDelete == 'true') {
            await task.destroy();
        } else {
            return res.status(200).json({ message: `Task is not deleted successfully!`, task });
        }

        return res.status(200).json({ message: `Task has been deleted successfully!`, task });
    } catch (error) {
        console.log(`Delete task error: ${error}`);
        return res.status(500).json({ message: `Failed to delete a task!` });
    }
};

exports.submitTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { task_id, earnings, status, proof, device_type } = req.body;
        if (!task_id || !earnings || !status || !proof || !device_type) {
            return res.status(400).json({ message: `All fields are required.` });
        };

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User not found!` });
        }
        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({ message: `Task not found!` });
        }

        let document;
        if (req.file) {
            document = req.file.filename;
        }        

        const taskSubmission = await TaskSubmission.create({
            user_id: user.id,
            task_id: task.id,
            proof,
            earnings,
            status,
            submitted_at: Date.now(),
            device_type,
            document
        });

        await Notifications.create({
            user_id: user.id,
            message: "New Task Submitted successfully!",
            type: "Pop-Up",
            visibility: "top",
            isRead: false
        });

        return res.status(200).json({
            message: `Task Submit Successfully!`,
            task: {
                id: taskSubmission.id,
                user_id: taskSubmission.user_id,
                task_id: taskSubmission.task_id,
                proof: taskSubmission.proof,
                status: taskSubmission.status,
                earnings: taskSubmission.earnings,
                submitted_at: taskSubmission.submitted_at,
                device_type: taskSubmission.device_type,
                document: taskSubmission.document
            }
        });
    } catch (error) {
        console.log(`Submit task error: ${error}`);
        return res.status(500).json({ message: `Failed to submit task!` });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { start = 0, limit = 10, searchText, country, category, payment_range } = req.query;

        start = parseInt(start);
        limit = parseInt(limit);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User not found!` });
        };

        const where = {};
        if (searchText) {
            where[Op.or] = [
                { name: { [Op.like]: `%${searchText}%` } },
                { description: { [Op.like]: `%${searchText}%` } }
            ];
        };
        if (country) {
            where.country_codes = { [Op.like]: `%${country}%` };
        };
        if (category) {
            where.category = category;
        };
        if (payment_range) {
            const [min, max] = payment_range.split('-').map(Number);
            console.log(min);
            console.log(max);
            if (!isNaN(min) && !isNaN(max)) {
                where.default_payout = {
                    [Op.between]: [min, max]
                }
            }
        };

        const { count, rows: tasks } = await Task.findAndCountAll({
            where,
            offset: start,
            limit,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json({
            message: `Tasks fetched successfully!`,
            total: count,
            totalPages: Math.ceil(count / limit),
            start,
            limit,
            tasks,
        });
    } catch (error) {
        console.log(`Get Tasks error: ${error}`);
        return res.status(500).json({ message: `Failed to get tasks!` });
    }
}

exports.submissionHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { start = 0, limit = 10 } = req.query;

        start = parseInt(start);
        limit = parseInt(limit);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User not found!` });
        }

        const { count, rows: taskHistory } = await TaskSubmission.findAndCountAll({
            where: { user_id: userId },
            offset: start,
            limit,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json({
            message: `Task submission history fetched successfully!`,
            total: count,
            start,
            limit,
            taskHistory
        });
    } catch (error) {
        console.log(`submissionHistory error: ${error}`);
        return res.status(500).json({ message: `Failed to get submission history!` });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { task_id } = req.params;

        if (!task_id) {
            return res.status(400).json({ message: `Task id must be required!` });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `User is not found!` });
        }

        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({ message: `Task is not found!` });
        }

        return res.status(200).json({ message: `Task fetched successfully!`, task });
    } catch (error) {
        console.log(`Get task by id error: ${error}`);
        return res.status(500).json({ message: `Failed to get specific task!` });
    }
};
