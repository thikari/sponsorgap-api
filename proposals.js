const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const ProposalsSchema = new Schema({

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
    },
    logo: {
        type: String,
    },
    industry: {
        type: String,
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    titlesponsorship: {
        type: String,
    },
    slotdescription: {
        type: String,
    },
    contact: {
        type: String,
    },
    type: {
        type: String,
    },
    adtype: {
        type: String,
    },
    price: {
        type: String,
    },
    charging: {
        type: String,   
    },
    link: {
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
function autopopulate(next) {
    this.populate('author');
    next();
}

module.exports = mongoose.model('proposals', ProposalsSchema);