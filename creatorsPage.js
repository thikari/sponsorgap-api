const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const CreatorsPageSchema = new Schema({

    _id: {
        type: ObjectId,
        auto: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: 'You must supply a Method'
    },
    subscribers: {
        type: String,
        required: 'You must supply a Method'
    },
    logo: {
        type: String,
    },
    link: {
        type: String,
    },
    twitter: {
        type: String,
    },
    contact: {
        type: String,
    },
    description: {
        type: String,
    },
    overview: {
        subscribers: [Number],
        openrate: [String],
        origins: [String],
        frequency: [String],
        industry: [String],
        slots: [String],
    },
    package: {
        pricing: [Number],
        book: [String],
        description: [String],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    slug: {
        type: String,
        slug: ["name"]
    }
});

module.exports = mongoose.model('creatorsPage', CreatorsPageSchema);