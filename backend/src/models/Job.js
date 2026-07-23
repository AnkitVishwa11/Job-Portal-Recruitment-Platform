const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'At least one requirement is required',
      },
    },
    responsibilities: {
      type: [String],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    workType: {
      type: String,
      enum: {
        values: ['remote', 'onsite', 'hybrid'],
        message: 'Work type must be remote, onsite, or hybrid',
      },
      required: [true, 'Work type is required'],
    },
    employmentType: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
        message: 'Employment type is not valid',
      },
      required: [true, 'Employment type is required'],
    },
    experienceLevel: {
      type: String,
      enum: {
        values: ['entry', 'mid', 'senior', 'lead', 'executive'],
        message: 'Experience level is not valid',
      },
      required: [true, 'Experience level is required'],
    },
    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD', trim: true },
      isNegotiable: { type: Boolean, default: false },
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    benefits: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
    },
    positions: {
      type: Number,
      default: 1,
      min: [1, 'Positions must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed', 'draft', 'filled'],
        message: 'Status is not valid',
      },
      default: 'open',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
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

jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, workType: 1, employmentType: 1, experienceLevel: 1 });
jobSchema.index({ userId: 1 });

module.exports = mongoose.model('Job', jobSchema);

