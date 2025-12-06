const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const BookmarksSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    created: { type: Date, default: Date.now },
    status: {type: String},
    favorites: 
        {
            type: String, 
            ref: 'sponsors'
        }
    ,
    sponsorId: {type: String}, // Add sponsorId field for bookmark functionality
    name: {type: String},
    industry: {type: String},
    type: {type: String},
    linkedin: {type: String},
    email: {type: String},
    sponsorof: {type: String},
    audience: {type: String},
    link: {type: String},
    slug: {type: String},
    userId: {type: String},
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    }
});

module.exports = mongoose.model('bookmarks', BookmarksSchema);