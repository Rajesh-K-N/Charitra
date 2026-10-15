const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies?.charitra_session;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        return next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired session. Please sign in again.' });
    }
};

module.exports = requireAuth;
