const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  // Booking identification
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Parties involved
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  
  // What's being booked
  listingType: {
    type: String,
    enum: ['ad-slot', 'cross-promotion', 'open-sponsorship', 'newsletter-feature'],
    required: true
  },
  listingId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  
  // Booking details
  packageDetails: {
    packageId: String,
    packageName: String,
    packageType: String,
    description: String,
    deliverables: [String],
    price: {
      type: Number,
      required: true
    },
    duration: String, // 'one-time', 'weekly', 'monthly'
    impressions: Number,
    clickThroughRate: Number
  },
  
  // Campaign details
  campaign: {
    title: String,
    description: String,
    targetAudience: String,
    creativeAssets: [String], // URLs to uploaded assets
    callToAction: String,
    landingUrl: String,
    trackingParams: String,
    startDate: Date,
    endDate: Date,
    requirements: String
  },
  
  // Payment information
  payment: {
    stripePaymentIntentId: String,
    stripeSessionId: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'usd'
    },
    platformFee: Number,
    creatorEarnings: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundedAt: Date
  },
  
  // Booking status and workflow
  status: {
    type: String,
    enum: ['draft', 'pending_payment', 'pending_approval', 'approved', 'in_progress', 'completed', 'canceled', 'disputed'],
    default: 'draft'
  },
  
  // Communication and updates
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    message: String,
    type: {
      type: String,
      enum: ['message', 'status_update', 'file_upload', 'approval_request'],
      default: 'message'
    },
    attachments: [String],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Performance tracking
  analytics: {
    impressions: Number,
    clicks: Number,
    clickThroughRate: Number,
    conversions: Number,
    conversionRate: Number,
    reach: Number,
    engagement: Number,
    lastTracked: Date
  },
  
  // Deliverables and proof of work
  deliverables: [{
    type: String, // 'newsletter_send', 'social_post', 'blog_mention', 'email_blast'
    description: String,
    scheduledDate: Date,
    completedDate: Date,
    proofUrl: String, // Screenshot or link
    metrics: {
      impressions: Number,
      clicks: Number,
      engagement: Number
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'approved'],
      default: 'pending'
    }
  }],
  
  // Reviews and feedback
  review: {
    brandRating: Number, // 1-5 stars
    brandFeedback: String,
    creatorRating: Number, // 1-5 stars
    creatorFeedback: String,
    overallExperience: Number,
    wouldRecommend: Boolean,
    reviewDate: Date
  },
  
  // Important dates
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  startedAt: Date,
  completedAt: Date,
  canceledAt: Date,
  
  // Additional metadata
  metadata: {
    source: String, // 'marketplace', 'direct', 'referral'
    referralCode: String,
    notes: String,
    internalTags: [String]
  }
});

// Middleware to update 'updated' field on save
bookingSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for booking URL
bookingSchema.virtual('bookingUrl').get(function() {
  return `/bookings/${this.bookingId}`;
});

// Virtual for total amount including platform fee
bookingSchema.virtual('totalAmount').get(function() {
  return this.payment.amount + (this.payment.platformFee || 0);
});

// Method to calculate platform fee (e.g., 5% of booking amount)
bookingSchema.methods.calculatePlatformFee = function() {
  const feePercentage = 0.05; // 5%
  this.payment.platformFee = Math.round(this.payment.amount * feePercentage * 100) / 100;
  this.payment.creatorEarnings = this.payment.amount - this.payment.platformFee;
  return this.payment.platformFee;
};

// Method to add message to conversation
bookingSchema.methods.addMessage = function(senderId, message, type = 'message', attachments = []) {
  this.messages.push({
    sender: senderId,
    message: message,
    type: type,
    attachments: attachments
  });
  return this.save();
};

// Method to update booking status with automatic notifications
bookingSchema.methods.updateStatus = function(newStatus, note = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add status update message
  if (note) {
    this.messages.push({
      sender: null, // System message
      message: `Status changed from ${oldStatus} to ${newStatus}. ${note}`,
      type: 'status_update'
    });
  }
  
  // Set important dates based on status
  switch (newStatus) {
    case 'approved':
      this.approvedAt = new Date();
      break;
    case 'in_progress':
      this.startedAt = new Date();
      break;
    case 'completed':
      this.completedAt = new Date();
      break;
    case 'canceled':
      this.canceledAt = new Date();
      break;
  }
  
  return this.save();
};

// Static method to get bookings for a user
bookingSchema.statics.getBookingsForUser = function(userId, role = 'brand') {
  const query = role === 'brand' ? { brand: userId } : { creator: userId };
  return this.find(query)
    .populate('brand', 'local.email')
    .populate('creator', 'local.email')
    .sort({ created: -1 });
};

// Indexes for better query performance
bookingSchema.index({ brand: 1, status: 1 });
bookingSchema.index({ creator: 1, status: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'payment.stripePaymentIntentId': 1 });
bookingSchema.index({ status: 1, created: -1 });

module.exports = mongoose.model('Booking', bookingSchema);