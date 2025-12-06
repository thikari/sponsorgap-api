const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;

const newsletterSubmissionSchema = new mongoose.Schema({
    newsletterName: {
        type: String,
        required: true,
        trim: true
    },
    newsletterUrl: {
        type: String,
        required: true,
        trim: true
    },
    submittedBy: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'added_to_mailparser', 'reviewed', 'declined'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    addedToCreators: {
        type: Boolean,
        default: false
    },
    creatorId: {
        type: ObjectId,
        ref: 'creators'
    }
});

// Index for efficient queries
newsletterSubmissionSchema.index({ status: 1, submissionDate: -1 });
newsletterSubmissionSchema.index({ newsletterUrl: 1 });
newsletterSubmissionSchema.index({ submittedBy: 1 });

module.exports = mongoose.model('NewsletterSubmission', newsletterSubmissionSchema);