const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('mongoose-slug-generator');

const options = {
  separator: "-", // Default separator
};
mongoose.plugin(slug, options);

const Schema = mongoose.Schema;

const SponsorsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: 'You must supply a name.',
    trim: true,
  },
  logo: {
    type: String,
    trim: true,
  },
  sponsorof: {
    type: String,
    required: 'You must supply a sponsor link.',
    trim: true,
  },
  audience: {
    type: Number,
    min: 0, // Ensure audience size cannot be negative
  },
  category: {
    type: String,
    trim: true,
  },
  advertise: {
    type: String,
    trim: true,
  },
  industryfield: {
    type: String,
    required: 'You must supply an industry field.',
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: 'You must supply a type description.',
    trim: true,
  },
  sponsordate: {
    type: Date, // ISO 8601 date format
  },
  contactinfo: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  adtype: {
    type: String,
    required: 'You must supply an ad type.',
    trim: true,
  },
  issue: {
    type: String,
    required: 'You must supply an issue.',
    trim: true,
  },
  issue_link: {
    type: String,
    trim: true,
  }, // URL to view the newsletter issue online for ad preview
  issue_title: {
    type: String,
    trim: true,
  }, // Actual extracted title from the newsletter issue
  adtext: {
    type: String,
    trim: true,
  },
  adSpend: {
    type: Number,
    min: 0, // Ensure ad spend cannot be negative
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
});

// Middleware: Generate a single-word slug
SponsorsSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    // Remove spaces and non-alphanumeric characters from the name
    this.slug = this.name.replace(/\s+/g, '').toLowerCase();
  }
  next();
});

// Apply case-insensitive collation for slug uniqueness
SponsorsSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

SponsorsSchema.post('save', function(doc) {
  const websocketService = require('../services/websocketService');
  if (this.isNew) {
    websocketService.broadcastSponsorUpdate('created', doc);
  } else {
    websocketService.broadcastSponsorUpdate('updated', doc);
  }
});

SponsorsSchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    const websocketService = require('../services/websocketService');
    websocketService.broadcastSponsorUpdate('updated', doc);
  }
});

SponsorsSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    const websocketService = require('../services/websocketService');
    websocketService.broadcastSponsorUpdate('deleted', doc);
  }
});

module.exports = mongoose.model('sponsors', SponsorsSchema);
