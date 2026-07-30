const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  imagePublicId: {
    type: String
  },
  author: {
    type: String,
    default: 'Swasti Foundation'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
