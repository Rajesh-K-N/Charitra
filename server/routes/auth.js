const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/requireAuth');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const cookieSameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || cookieSameSite === 'none',
    sameSite: cookieSameSite,
    path: '/api'
};
const sessionCookieName = 'charitra_session';

router.post('/register', async (req, res) => {
    const { name, email, password, website } = req.body || {};

    if (website) {
        return res.status(400).json({ message: 'Invalid request.' });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const safeName = name.replace(/[\u0000-\u001f\u007f]/g, '').trim();
    const safeEmail = email.trim().toLowerCase();
    if (safeName.length < 1 || safeName.length > 80 ||
        safeEmail.length > 254 || !isValidEmail(safeEmail) ||
        password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({
            message: 'Provide a name (1–80 characters), a valid email, and a password (8–72 UTF-8 bytes).'
        });
    }

    const userExists = await User.findOne({ email: safeEmail }).select('_id');
    if (userExists) {
        return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name: safeName, email: safeEmail, password: hashedPassword });
    const savedUser = await newUser.save();

    res.set('Cache-Control', 'no-store');
    res.status(201).json({ user: savedUser._id });
});

router.get('/session', requireAuth, async (req, res) => {
    const user = await User.findById(req.user._id).select('name email points streaks dailyReads');
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.set('Cache-Control', 'no-store');
    return res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            streaks: user.streaks,
            dailyReads: user.dailyReads
        }
    });
});

router.post('/login', async (req, res) => {
    const { email, password, website } = req.body || {};

    if (website) {
        return res.status(400).json({ message: 'Invalid request.' });
    }

    if (typeof email !== 'string' || typeof password !== 'string' ||
        email.length > 254 || Buffer.byteLength(password, 'utf8') > 72 || !isValidEmail(email.trim())) {
        return res.status(400).json({ message: 'Provide a valid email and password.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });

    res.set('Cache-Control', 'no-store');
    res.cookie(sessionCookieName, token, {
        ...sessionCookieOptions,
        maxAge: 60 * 60 * 1000
    });
    return res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            streaks: user.streaks,
            dailyReads: user.dailyReads
        }
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie(sessionCookieName, sessionCookieOptions);
    return res.status(204).end();
});

module.exports = router;
