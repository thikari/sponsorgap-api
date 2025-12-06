const mongoose = require('mongoose');

const rawSponsorSchema = new mongoose.Schema(
  {
    name: String,
    adtype: String,
    adtext: String,
    industryfield: String,
    type: String,
    description: String,
    category: String,
    sponsorof: String,
    audience: String, 
    advertiseurl: String,
    sponsordate: {
        type: Date,
  
    }, 
    issue: String,
    issue_link: String, // URL to view the newsletter issue online for ad preview
    issue_title: String, // Actual extracted title from the newsletter issue
    link: String,
    enriched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RawSponsor', rawSponsorSchema);
