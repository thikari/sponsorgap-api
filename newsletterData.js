const mongoose = require('mongoose');

const newsletterIssueSchema = new mongoose.Schema({
  newsletterName: String,
  newsletterLink: String,
  issueLink: String,
  publishDate: String,
  keyphrases: [String],
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('NewsletterIssue', newsletterIssueSchema);
