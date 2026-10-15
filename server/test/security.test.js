const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { after, before, test } = require('node:test');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'production';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/charitra-test';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.COOKIE_SAME_SITE = 'lax';
process.env.VERCEL_URL = 'charitra-preview.vercel.app';
process.env.VERCEL_BRANCH_URL = 'charitra-git-main.vercel.app';
process.env.VERCEL_PROJECT_PRODUCTION_URL = 'charitra.example.com';

let databaseConnectCalls = 0;
mongoose.connect = async () => {
    databaseConnectCalls += 1;
    return mongoose;
};

const app = require('../index');
let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

test('API responds with security headers and hides Express details', async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-powered-by'), null);
    assert.ok(response.headers.get('content-security-policy'));
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
    assert.ok(response.headers.get('strict-transport-security'));
});

test('API requests initialize MongoDB when the app is imported as a serverless function', async () => {
    const response = await fetch(`${baseUrl}/api/not-a-route`);
    assert.equal(response.status, 404);
    assert.equal(databaseConnectCalls, 1);
});

test('CORS allows only the configured frontend origin', async () => {
    const allowed = await fetch(`${baseUrl}/`, { headers: { Origin: 'http://localhost:5173' } });
    const vercelPreview = await fetch(`${baseUrl}/`, { headers: { Origin: 'https://charitra-preview.vercel.app' } });
    const vercelProduction = await fetch(`${baseUrl}/`, { headers: { Origin: 'https://charitra.example.com' } });
    const denied = await fetch(`${baseUrl}/`, { headers: { Origin: 'https://untrusted.example' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true');
    assert.equal(vercelPreview.headers.get('access-control-allow-origin'), 'https://charitra-preview.vercel.app');
    assert.equal(vercelProduction.headers.get('access-control-allow-origin'), 'https://charitra.example.com');
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
});

test('oversized JSON bodies receive a safe 413 response', async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Origin: 'http://localhost:5173'
        },
        body: JSON.stringify({ name: 'reader', email: `${'a'.repeat(11 * 1024)}@example.com`, password: 'long-password' })
    });
    const body = await response.json();
    assert.equal(response.status, 413);
    assert.deepEqual(body, { message: 'Request body is too large.' });
});

test('unknown API routes return a custom 404 response', async () => {
    const response = await fetch(`${baseUrl}/api/not-a-route`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { message: 'Not found' });
});

test('invalid registration input is rejected before database access', async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Origin: 'http://localhost:5173'
        },
        body: JSON.stringify({ name: { $ne: null }, email: 'not-an-email', password: 'short' })
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
        message: 'Name, email, and password are required.'
    });
});

test('unknown scripture identifiers are rejected', async () => {
    const response = await fetch(`${baseUrl}/api/books/content/not-a-book/1`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { message: 'Scripture page not found.' });
});

test('protected book routes require a valid session cookie', async () => {
    const response = await fetch(`${baseUrl}/api/books/my-progress`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: 'Authentication required.' });
});

test('logout clears a secure, HttpOnly, same-site session cookie', async () => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Origin: 'http://localhost:5173' }
    });
    const cookie = response.headers.get('set-cookie');
    assert.equal(response.status, 204);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /SameSite=Lax/i);
    assert.match(cookie, /Path=\/api/i);
});

test('state-changing requests reject an untrusted origin', async () => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Origin: 'https://untrusted.example' }
    });
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { message: 'Request origin is not allowed.' });
});

test('state-changing requests accept the current Vercel deployment origin', async () => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Origin: 'https://charitra-preview.vercel.app' }
    });
    assert.equal(response.status, 204);
});

test('production rejects state-changing requests without an Origin', async () => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { message: 'Request origin is not allowed.' });
});
