const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    resume: {
      type: String,
      required: [true, 'Resume is required'],
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
        message: 'Status is not valid',
      },
      default: 'pending',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          maxlength: [500, 'Note cannot exceed 500 characters'],
        },
      },
    ],
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    withdrawnAt: {
      type: Date,
    },
    hiredAt: {
      type: Date,
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

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ userId: 1 });

module.exports = mongoose.model('Application', applicationSchema);

