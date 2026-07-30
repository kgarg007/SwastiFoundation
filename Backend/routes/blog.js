const express = require('express');
const fs = require('fs');
const Blog = require('../model/blog');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const uploadOnCloudinary = require('../utils/fileUpload');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find().sort({ publishedDate: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create blog post (Protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, category, excerpt, content, author, publishedDate, link } = req.body;
    if (!title || !excerpt || !content) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Title, excerpt, and content are required fields.' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const cloudinaryRes = await uploadOnCloudinary(req.file.path);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (!cloudinaryRes || cloudinaryRes === "Error Occured") {
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary.' });
      }

      imageUrl = cloudinaryRes.secure_url || cloudinaryRes.url;
      imagePublicId = cloudinaryRes.public_id;
    }

    const newPost = new Blog({
      title,
      category,
      excerpt,
      content,
      image: imageUrl,
      imagePublicId: imagePublicId,
      author,
      publishedDate: publishedDate || Date.now(),
      link: link || ''
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT update blog post (Protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, category, excerpt, content, author, publishedDate, link } = req.body;
    const post = await Blog.findById(req.params.id);
    if (!post) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (title) post.title = title;
    if (category) post.category = category;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (author) post.author = author;
    if (publishedDate) post.publishedDate = publishedDate;
    if (link !== undefined) post.link = link;

    if (req.file) {
      const cloudinaryRes = await uploadOnCloudinary(req.file.path);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (!cloudinaryRes || cloudinaryRes === "Error Occured") {
        return res.status(500).json({ error: 'Failed to upload new image to Cloudinary.' });
      }

      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }

      post.image = cloudinaryRes.secure_url || cloudinaryRes.url;
      post.imagePublicId = cloudinaryRes.public_id;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE blog post (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });

    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
