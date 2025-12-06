const mongoose = require('mongoose');

const userAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    categories: [{
        type: String,
    }],
    lastNotificationSent: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserAlert', userAlertSchema); 