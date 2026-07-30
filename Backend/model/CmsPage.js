const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    metaTitle: {
      type: String,
      default: '',
      trim: true
    },
    metaDescription: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CmsPage', cmsPageSchema);
