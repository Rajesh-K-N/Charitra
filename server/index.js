const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const cookieSameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
const deploymentOrigin = (domain) => {
    if (!domain) {
        return null;
    }

    const url = new URL(domain.includes('://') ? domain : `https://${domain}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash) {
        throw new Error('Vercel deployment origin must be a valid host without a path');
    }
    return url.origin;
};
const configuredOrigins = (process.env.CLIENT_ORIGIN || (isProduction ? '' : 'http://localhost:5173'))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => deploymentOrigin(origin));
const vercelOrigins = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
]
    .filter(Boolean)
    .map((domain) => deploymentOrigin(domain));
const allowedOrigins = [...new Set([...configuredOrigins, ...vercelOrigins])];
let databaseConnectionPromise;
mongoose.connection.on('disconnected', () => {
    databaseConnectionPromise = null;
});

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be configured in server/.env');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
}

if (isProduction && allowedOrigins.length === 0) {
    throw new Error('CLIENT_ORIGIN must be configured in production');
}

if (!['lax', 'strict', 'none'].includes(cookieSameSite)) {
    throw new Error('COOKIE_SAME_SITE must be lax, strict, or none');
}

app.disable('x-powered-by');
app.set('trust proxy', isProduction ? 1 : false);

app.use(helmet({
    strictTransportSecurity: isProduction ? undefined : false
}));

app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 600
}));

app.use(cookieParser());
app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const origin = req.get('Origin');
        if ((!origin && isProduction) || (origin && !allowedOrigins.includes(origin))) {
            return res.status(403).json({ message: 'Request origin is not allowed.' });
        }
    }
    return next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
}));

async function ensureDatabaseConnected() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!databaseConnectionPromise) {
        databaseConnectionPromise = mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('MongoDB Connected');
            })
            .catch((error) => {
                databaseConnectionPromise = null;
                throw error;
            });
    }

    await databaseConnectionPromise;
}

app.use('/api', async (req, res, next) => {
    try {
        await ensureDatabaseConnected();
        return next();
    } catch (error) {
        return next(error);
    }
});

const authenticationRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts. Please try again later.' }
});

app.use('/api/auth/login', authenticationRateLimit);
app.use('/api/auth/register', authenticationRateLimit);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

app.get('/', (req, res) => {
    res.json({ message: 'Charitra API is running' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Request body is too large.' });
    }

    if (err.status === 400 || err.status === 415) {
        return res.status(err.status).json({ message: 'Invalid request.' });
    }

    console.error('Unexpected API request failure:', err);

    return res.status(500).json({ message: 'Internal server error.' });
});

async function start() {
    await ensureDatabaseConnected();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

if (require.main === module) {
    start().catch((err) => {
        console.error('Server startup failed; verify database and environment configuration.');
        process.exitCode = 1;
    });
}

module.exports = app;
