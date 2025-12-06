const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const userInformationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    _id: {
        type: ObjectId,
        auto: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    project_name: {
        type: String
    },
    contact_email: {
        type: String
    },
    website_url: {
        type: String
    }
});



module.exports = mongoose.model('userInformation', userInformationSchema);