const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/requireAuth');
const scriptures = require('../data/scriptures.json');

const parsePage = (value) => {
    if (!/^[1-9]\d{0,3}$/.test(value)) {
        return null;
    }
    return Number(value);
};

router.get('/content/:bookId/:page', (req, res) => {
    const { bookId } = req.params;
    const page = parsePage(req.params.page);

    if (!Object.hasOwn(scriptures, bookId) || page === null) {
        return res.status(404).json({ message: 'Scripture page not found.' });
    }

    const content = scriptures[bookId][page];
    return res.json({
        content: content || 'You have reached the end of this scripture for now. Check back later for more verses!',
        page,
        bookId
    });
});

router.post('/progress', verify, async (req, res) => {
    const { bookId, page } = req.body || {};
    const validBook = typeof bookId === 'string' && Object.hasOwn(scriptures, bookId);

    if (!validBook || !Number.isSafeInteger(page) || page < 1 ||
        !Object.hasOwn(scriptures[bookId], String(page))) {
        return res.status(400).json({ message: 'Provide a valid scripture page.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.progress) {
        user.progress = new Map();
    }

    if (page <= (user.progress.get(bookId) || 0)) {
        return res.status(409).json({ message: 'This page has already been completed.' });
    }

    user.progress.set(bookId, page);

    const today = new Date();
    const lastRead = user.lastReadDate ? new Date(user.lastReadDate) : null;
    const isNewDay = !lastRead ||
        lastRead.getDate() !== today.getDate() ||
        lastRead.getMonth() !== today.getMonth() ||
        lastRead.getFullYear() !== today.getFullYear();

    if (isNewDay) {
        user.dailyReads = 0;
        if (!lastRead) {
            user.streaks = 1;
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const readYesterday = lastRead.getDate() === yesterday.getDate() &&
                lastRead.getMonth() === yesterday.getMonth() &&
                lastRead.getFullYear() === yesterday.getFullYear();
            user.streaks = readYesterday ? user.streaks + 1 : 1;
        }
    }

    user.dailyReads += 1;
    user.points += 10;
    user.lastReadDate = today;
    await user.save();

    return res.json({
        message: 'Progress updated',
        points: user.points,
        dailyReads: user.dailyReads,
        streaks: user.streaks,
        progress: Object.fromEntries(user.progress)
    });
});

router.get('/my-progress', verify, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
        points: user.points,
        streaks: user.streaks,
        dailyReads: user.dailyReads || 0,
        progress: user.progress ? Object.fromEntries(user.progress) : {}
    });
});

router.post('/reset-progress', verify, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.points = 0;
    user.streaks = 0;
    user.dailyReads = 0;
    await user.save();

    return res.json({
        message: 'Karma reset successfully',
        points: user.points,
        streaks: user.streaks,
        dailyReads: user.dailyReads,
        progress: user.progress ? Object.fromEntries(user.progress) : {}
    });
});

router.get('/leaderboard', verify, async (req, res) => {
    const users = await User.find()
        .sort({ points: -1 })
        .limit(10)
        .select('name points streaks');
    return res.json(users);
});

module.exports = router;
