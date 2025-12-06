const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;
var md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    _id: {
        type: ObjectId,
        auto: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    subscriptionId: {
        type: String,
    },
    hasAccess: { 
        type: Boolean,
        default: false
    },
    customerId: {
        type: String,
    },
    subscriptionStatus: {
        type: String,
    },
    tier: {
        type: String,
    },
    stripeCust: {
        type: String
    },
    payment_status: {
        type: String,
        default: "unpaid"
    },
    accountType: {
        type: String,
        default: 'free'
    },
    tier: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    freeTierUsage: {
        sponsorsViewed: { type: Number, default: 0 },
        profilesViewed: { type: Number, default: 0 },
        datasetsAccessed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },
    monthlyLimits: {
        sponsorsViewed: { type: Number, default: 10 },
        profilesViewed: { type: Number, default: 3 },
        datasetsAccessed: { type: Number, default: 1 }
    },
    planType: {
        type: String,
        default: 'creator'
    },
    

    favorites : [{ type: Schema.Types.ObjectId, ref: 'bookmarks' }],
        //paddle
        email: {
            type: String,
        },
        status: {
            type: String,
        },
        CancelUrl: {   
            type: String,
        },
        ReceiptUrl: {
            type: String,
        },
        subscription_id:{
            type: String,
        },
        user_id: {
            type: String,
        },
        lastLogin: {
            type: Date,
            default: Date.now // Automatically set to current date on creation
        },
    local: {
        email: {
            type: String,
            // unique: true,
            // lowercase: true,
            // trim: true,
            // validate: [validator.isEmail, 'Invalid Email Address'],
            required: 'Please Supply an email address'
        },
        password: String,
        slug: {
            type: String,
            slug: ["local.username"]
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    apiKey: {
        type: String,
        unique: true,
        sparse: true
    },
    apiKeyCreated: {
        type: Date
    },
    apiKeyLastUsed: {
        type: Date
    },
    firehoseAccess: {
        type: Boolean,
        default: false
    },
    firehoseRateLimit: {
        type: Number,
        default: 1000
    },
    firehoseConnectionsLimit: {
        type: Number,
        default: 5
    },
    activeConnections: {
        type: Number,
        default: 0
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'local.email'
});
userSchema.plugin(mongodbErrorHandler);

userSchema.methods.gravatar = function gravatar(size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('users', userSchema);