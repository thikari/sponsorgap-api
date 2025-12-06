const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    sender: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    recipient: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    subject: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    messageType: {
        type: String,
        enum: ['cross_promotion', 'general', 'collaboration', 'inquiry'],
        default: 'general'
    },
    relatedPromotion: {
        type: ObjectId,
        ref: 'promotion',
        default: null
    },
    relatedCreator: {
        type: ObjectId,
        ref: 'creators',
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

// Update the updated field before saving
MessageSchema.pre('save', function(next) {
    this.updated = new Date();
    next();
});

// Method to mark message as read
MessageSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to get unread count for a user
MessageSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({
        recipient: userId,
        isRead: false
    });
};

// Static method to get messages for a user with pagination
MessageSchema.statics.getMessagesForUser = function(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    
    let query = { recipient: userId };
    if (unreadOnly) {
        query.isRead = false;
    }
    
    return this.find(query)
        .sort({ created: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
};

module.exports = mongoose.model('message', MessageSchema);