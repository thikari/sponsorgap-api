const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const ProjectsSchema = new Schema({

    _id: {
        type: ObjectId,
        auto: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    projectname: {
        type: String,
       
    },
    contactemail: {
        type: String,
    },
    website: {
        type: String,
    },
    about: {
        type: String,
        
    },
    email: {
        type: String,   
    },
    twitter: {
        type: String,   
    },
    link: {
        type: String,   
    },
    subscribers: {
        type: String,
        
    },
    openrate: {
        type: String,   
    },
    usersorigin: {
        type: String,   
    },
    frequency: {
        type: String,   
    },
    logo: {
        type: String,
        
    },
    industry: {
        type: String,
        
    },
    slots: {
        type: String,   
    },
    nameslot1: {
        type: String,   
    },
    linkslot1: {
        type: String,   
    },
    priceslot1: {
        type: String,   
    },
    paymentlinkslot1: {
        type: String,   
    },
    nameslot2: {
        type: String,   
    },
    linkslot2: {
        type: String,   
    },
    priceslot2: {
        type: String,   
    },
    paymentlinkslot2: {
        type: String,   
    },
    nameslot3: {
        type: String,   
    },
    linkslot3: {
        type: String,   
    },
    priceslot3: {
        type: String,   
    },
    paymentlinkslot3: {
        type: String,   
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
function autopopulate(next) {
    this.populate('author');
    next();
}

module.exports = mongoose.model('projects', ProjectsSchema);