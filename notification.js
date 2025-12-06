const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  // Recipient information
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Notification type and category
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_approved',
      'booking_declined',
      'payment_received',
      'payment_failed',
      'campaign_started',
      'campaign_completed',
      'deliverable_submitted',
      'deliverable_approved',
      'message_received',
      'review_received',
      'system_alert',
      'marketplace_update',
      'account_update'
    ],
    required: true
  },
  
  // Related entities
  relatedBooking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedUser: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  relatedListing: {
    type: Schema.Types.ObjectId
  },
  
  // Notification metadata
  data: {
    bookingId: String,
    amount: Number,
    packageName: String,
    creatorName: String,
    brandName: String,
    actionUrl: String, // URL to navigate to when clicked
    imageUrl: String,
    customData: Schema.Types.Mixed
  },
  
  // Status tracking
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Delivery tracking
  channels: {
    inApp: {
      sent: { type: Boolean, default: true },
      sentAt: { type: Date, default: Date.now }
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date
    }
  },
  
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Expiration (for temporary notifications)
  expiresAt: Date,
  
  // Timestamps
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update 'updated' field
notificationSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

// Mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create and send notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this({
    recipient: data.recipient,
    title: data.title,
    message: data.message,
    type: data.type,
    relatedBooking: data.relatedBooking,
    relatedUser: data.relatedUser,
    relatedListing: data.relatedListing,
    data: data.data || {},
    priority: data.priority || 'medium'
  });
  
  await notification.save();
  
  // Send email notification if enabled
  if (data.sendEmail) {
    await notification.sendEmailNotification();
  }
  
  // TODO: Implement real-time socket notification here
  // if (data.sendRealtime) {
  //   await notification.sendRealtimeNotification();
  // }
  
  return notification;
};

// Send email notification
notificationSchema.methods.sendEmailNotification = async function() {
  const postmark = require('postmark');
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
  
  try {
    // Get recipient email
    const User = mongoose.model('users');
    const recipient = await User.findById(this.recipient);
    
    if (!recipient || !recipient.local.email) {
      console.log('No email found for notification recipient');
      return;
    }
    
    const emailTemplate = this.getEmailTemplate();
    
    await client.sendEmail({
      From: 'notifications@sponsorgap.com',
      To: recipient.local.email,
      Subject: this.title,
      HtmlBody: emailTemplate.html,
      TextBody: emailTemplate.text
    });
    
    // Update delivery status
    this.channels.email.sent = true;
    this.channels.email.sentAt = new Date();
    await this.save();
    
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
};

// Get email template based on notification type
notificationSchema.methods.getEmailTemplate = function() {
  const baseUrl = process.env.APP_URL || 'https://app.sponsorgap.com';
  const actionUrl = this.data.actionUrl ? `${baseUrl}${this.data.actionUrl}` : baseUrl;
  
  const templates = {
    booking_request: {
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">New Booking Request</h2>
          <p>You have received a new sponsorship booking request!</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${this.data.packageName || 'Sponsorship Package'}</h3>
            <p><strong>Brand:</strong> ${this.data.brandName}</p>
            <p><strong>Amount:</strong> $${this.data.amount}</p>
          </div>
          <a href="${actionUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Booking Details</a>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">Best regards,<br>SponsorGap Team</p>
        </div>
      `,
      text: `New Booking Request\n\n${this.message}\n\nView details: ${actionUrl}`
    },
    payment_received: {
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Received</h2>
          <p>Great news! Your payment has been processed successfully.</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <p><strong>Amount:</strong> $${this.data.amount}</p>
            <p><strong>Booking:</strong> ${this.data.bookingId}</p>
          </div>
          <a href="${actionUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Booking</a>
        </div>
      `,
      text: `Payment Received\n\n${this.message}\n\nView booking: ${actionUrl}`
    }
  };
  
  return templates[this.type] || {
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${this.title}</h2>
        <p>${this.message}</p>
        <a href="${actionUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Details</a>
      </div>
    `,
    text: `${this.title}\n\n${this.message}\n\nView details: ${actionUrl}`
  };
};

// Static method to get unread notifications for user
notificationSchema.statics.getUnreadForUser = function(userId, limit = 10) {
  return this.find({ 
    recipient: userId, 
    isRead: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .populate('relatedUser', 'local.email')
  .populate('relatedBooking', 'bookingId packageDetails.packageName')
  .sort({ created: -1 })
  .limit(limit);
};

// Static method to mark multiple notifications as read
notificationSchema.statics.markMultipleAsRead = function(userId, notificationIds) {
  return this.updateMany(
    { 
      recipient: userId,
      _id: { $in: notificationIds }
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

// Indexes for performance
notificationSchema.index({ recipient: 1, isRead: 1, created: -1 });
notificationSchema.index({ type: 1, created: -1 });
notificationSchema.index({ relatedBooking: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);