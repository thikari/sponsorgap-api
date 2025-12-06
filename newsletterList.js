const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const newsletterListSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    _id: {
        type: ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: 'Please provide a name for the list',
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    newsletters: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        addedDate: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    isDefault: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: ["name"]
    }
});

function autopopulate(next) {
    this.populate('userId');
    next();
}

newsletterListSchema.pre('find', autopopulate);
newsletterListSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('NewsletterList', newsletterListSchema);