const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;


const UserSchema = new Schema({
    // created: {
    //     type: Date,
    //     default: Date.now
    // },
    id: {
        type: String,

    },
    email: {
        type: String,

    },



});



module.exports = mongoose.model('User', UserSchema);