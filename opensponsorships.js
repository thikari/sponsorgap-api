const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const OpensponsorshipsSchema = new Schema({

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
        
    },
    link: {
        type: String,
    },
    industry: {
        type: String,    
    },
    type: {
        type: String,
    },
    description: {
        type: String,
        ref: 'contact',
    },
    deadline: {
        type: Date,  
    },
    title: {
        type: String,
    },
    contact: {
        type: String,
    },
    budget: {
        type: String,
    },
    author: {
        type: ObjectId,
        ref: 'users',
    },
    slug: {
        type: String,
        slug: ["name"]
    }
});

module.exports = mongoose.model('opensponsorships', OpensponsorshipsSchema);