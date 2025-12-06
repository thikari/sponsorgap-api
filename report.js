const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Replace 'User' with the name of your user model
        required: true
    },
    name: String,
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'], // Assuming these are your frequency options
        required: true
    },
    sponsorType: String,
    industry: [String],
    maxSponsors: Number,
    estimatedRevenue: String,
    active: {
        type: Boolean,
        default: true
    },
    selectedNewsletters: [String],
    recipients: [String], // Assuming there can be multiple recipients
    
    // CSV Field Selection
    selectedFields: {
        type: [String],
        default: ['sponsorType', 'audience', 'link', 'sponsordate', 'sponsorof'],
        validate: {
            validator: function(fields) {
                const validFields = [
                    'sponsorType', 'audience', 'link', 'adtext', 'category', 
                    'sponsordate', 'sponsorof', 'issue_title', 'issue_link', 
                    'contactinfo', 'linkedin'
                ];
                return fields.every(field => validFields.includes(field));
            },
            message: 'Invalid field selection'
        }
    },
    
    // SIMPLIFIED FILTERING OPTIONS
    audienceFilter: {
        minAudience: Number
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastSent: {
        type: Date,
        default: null // This will be updated when a report is sent
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;