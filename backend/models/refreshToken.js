
const mongoose = require('mongoose');
const User = require('./user');

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expiresAt: '1m' }
    },  
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model('RefreshToken', RefreshTokenSchema );