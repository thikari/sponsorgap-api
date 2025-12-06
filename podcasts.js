const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const PodcastsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: 'You must supply a podcast name.',
    trim: true,
  },
  link: {
    type: String,
    unique: true,
  },
  contact: {
    type: String,
  },
  industry:  [String],
  description: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  audience: {
    type: Number,
    min: 0,
  },
  logo: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    slug: ["name"],
    unique: true,
    trim: true,
  },
  // Add more fields as needed
});

module.exports = mongoose.model('podcasts', PodcastsSchema); 