const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254
    },
    password: {
        type: String,
        required: true,
        maxlength: 128
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
}, { timestamps: true, collection: 'gamified knowledge' });

module.exports = mongoose.model('User', UserSchema);
