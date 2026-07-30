const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    streaks: {
        type: Number,
        default: 0
    },
    dailyReads: {
        type: Number,
        default: 0
    },
    lastReadDate: {
        type: Date,
        default: null
    },
    progress: {
        // Map of bookId to page number
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
