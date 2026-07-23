const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          'application_received',
          'application_status',
          'application_shortlisted',
          'application_rejected',
          'application_hired',
          'application_withdrawn',
          'job_opening',
          'job_closed',
          'job_filled',
          'saved_job_update',
          'profile_viewed',
          'message',
          'system',
        ],
        message: 'Notification type is not valid',
      },
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    data: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      url: {
        type: String,
        trim: true,
      },
      metadata: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

/**
 * Mark notification as read
 */
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

/**
 * Static method to create a notification
 * @param {Object} data - Notification data
 * @returns {Object} Created notification
 */
notificationSchema.statics.createNotification = async function (data) {
  return this.create(data);
};

/**
 * Static method to mark all user notifications as read
 * @param {string} userId - User ID
 */
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

/**
 * Static method to get unread count for a user
 * @param {string} userId - User ID
 * @returns {number} Unread count
 */
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

module.exports = mongoose.model('Notification', notificationSchema);


