const mongoose = require('mongoose');

// Define the schema
const engineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Assuming each name should be unique
    },
    audienceSize: {
        type: Number,
        required: true // Assuming you always want to store the audience size
    },
    industryfield: {
        type: String,
        required: true
    },
    formUsageCount: {
        type: Number,
        default: 0 // Starts with 0 and increments each time the form is used
    }
});

// Create the model
const Engine = mongoose.model('Engine', engineSchema);

module.exports = Engine;
