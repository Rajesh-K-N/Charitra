const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verify = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const scriptures = require('../data/scriptures.json');

// Get Content
router.get('/content/:bookId/:page', (req, res) => {
    const { bookId, page } = req.params;

    if (scriptures[bookId] && scriptures[bookId][page]) {
        const content = scriptures[bookId][page];
        res.json({ content, page: parseInt(page), bookId });
    } else {
        res.json({ content: "You have reached the end of this scripture for now. Check back later for more verses!", page: parseInt(page), bookId });
    }
});

// Update Progress
router.post('/progress', verify, async (req, res) => {
    try {
        const { bookId, page } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        // Update progress
        if (!user.progress) {
            user.progress = new Map();
        }
        user.progress.set(bookId, page);

        // Daily Goal & Streak Logic
        const today = new Date();
        const lastRead = user.lastReadDate ? new Date(user.lastReadDate) : null;

        // Check if it's a new day
        const isNewDay = !lastRead ||
            lastRead.getDate() !== today.getDate() ||
            lastRead.getMonth() !== today.getMonth() ||
            lastRead.getFullYear() !== today.getFullYear();

        if (isNewDay) {
            user.dailyReads = 0; // Reset for new day

            // Streak Logic
            if (lastRead) {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                const isYesterday =
                    lastRead.getDate() === yesterday.getDate() &&
                    lastRead.getMonth() === yesterday.getMonth() &&
                    lastRead.getFullYear() === yesterday.getFullYear();

                if (isYesterday) {
                    user.streaks += 1;
                } else {
                    user.streaks = 1;
                }
            } else {
                user.streaks = 1;
            }
        }

        user.dailyReads += 1;
        user.points += 10;
        user.lastReadDate = today;

        await user.save();

        res.json({
            message: 'Progress updated',
            points: user.points,
            dailyReads: user.dailyReads,
            streaks: user.streaks,
            progress: Object.fromEntries(user.progress)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Progress
router.get('/my-progress', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            points: user.points,
            streaks: user.streaks,
            dailyReads: user.dailyReads || 0,
            progress: user.progress ? Object.fromEntries(user.progress) : {}
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Progress
router.post('/reset-progress', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.points = 0;
        user.streaks = 0;
        user.dailyReads = 0;
        // We keep reading progress (bookmarks) as per plan

        await user.save();

        res.json({
            message: 'Karma reset successfully',
            points: user.points,
            streaks: user.streaks,
            dailyReads: user.dailyReads,
            progress: user.progress ? Object.fromEntries(user.progress) : {}
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Leaderboard
router.get('/leaderboard', verify, async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select('name points streaks'); // Select only necessary fields

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
