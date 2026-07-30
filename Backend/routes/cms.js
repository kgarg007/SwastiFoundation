const express = require('express');
const CmsPage = require('../model/CmsPage');
const auth = require('../middleware/auth');

const router = express.Router();

const RESERVED_SLUGS = [
  'privacy-policy',
  'terms-and-conditions',
  'donation-refund-policy',
  'disclaimer',
  'contact'
];

// Helper to set strict cache-busting headers
const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

// Helper to fetch all pages for Admin
const getAdminPages = async (req, res) => {
  try {
    setNoCacheHeaders(res);
    const pages = await CmsPage.find({ slug: { $in: RESERVED_SLUGS } }).sort({ createdAt: 1 });
    console.log(`[CMS ADMIN GET ALL] Returning ${pages.length} canonical pages`);
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper to create page
const createPage = async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, status } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required fields.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await CmsPage.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ error: `A page with slug "${cleanSlug}" already exists.` });
    }

    const newPage = new CmsPage({
      title,
      slug: cleanSlug,
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      status: status || 'published'
    });

    await newPage.save();
    setNoCacheHeaders(res);
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper to update page
const updatePage = async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, status } = req.body;
    const pageId = req.params.id;

    const pageToUpdate = await CmsPage.findById(pageId);
    if (!pageToUpdate) {
      return res.status(404).json({ error: 'CMS page not found.' });
    }

    const isReserved = RESERVED_SLUGS.includes(pageToUpdate.slug);

    // Only reject if an incoming slug is provided AND it is DIFFERENT from existing reserved slug
    if (slug && slug.toLowerCase().trim() !== pageToUpdate.slug.toLowerCase().trim() && isReserved) {
      return res.status(400).json({ error: 'Slug for reserved page cannot be modified.' });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (status) updateFields.status = status;
    if (metaTitle !== undefined) updateFields.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateFields.metaDescription = metaDescription;

    // Allow slug updates ONLY for non-reserved custom pages if changed
    if (!isReserved && slug) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
      if (cleanSlug !== pageToUpdate.slug) {
        const existingWithSlug = await CmsPage.findOne({ slug: cleanSlug, _id: { $ne: pageId } });
        if (existingWithSlug) {
          return res.status(400).json({ error: `A page with slug "${cleanSlug}" already exists.` });
        }
        updateFields.slug = cleanSlug;
      }
    }

    const updatedDocument = await CmsPage.findByIdAndUpdate(
      pageId,
      { $set: updateFields },
      { new: true, returnDocument: 'after', runValidators: true }
    );

    console.log(`[CMS UPDATE SUCCESS] Saved slug: "${updatedDocument.slug}", Title: "${updatedDocument.title}", Status: ${updatedDocument.status}`);
    setNoCacheHeaders(res);
    res.json(updatedDocument);
  } catch (error) {
    console.error('[CMS UPDATE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Helper to delete page
const deletePage = async (req, res) => {
  try {
    const page = await CmsPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'CMS page not found.' });
    }

    if (RESERVED_SLUGS.includes(page.slug)) {
      return res.status(400).json({ error: `Reserved page "${page.slug}" cannot be deleted.` });
    }

    await page.deleteOne();
    setNoCacheHeaders(res);
    res.json({ message: 'Page deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Admin list handlers
router.get('/admin/all', auth, getAdminPages);
router.get('/admin/cms', auth, getAdminPages);
router.get('/admin', auth, getAdminPages);

// POST Admin create handlers
router.post('/admin/cms', auth, createPage);
router.post('/admin', auth, createPage);

// PUT Admin update handlers
router.put('/admin/cms/:id', auth, updatePage);
router.put('/admin/:id', auth, updatePage);

// DELETE Admin delete handlers
router.delete('/admin/cms/:id', auth, deletePage);
router.delete('/admin/:id', auth, deletePage);

// GET /cms/:slug - Fetch published CMS page by slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    setNoCacheHeaders(res);
    let requestedSlug = req.params.slug.toLowerCase().trim();
    if (requestedSlug === 'terms') requestedSlug = 'terms-and-conditions';
    if (requestedSlug === 'refund-policy') requestedSlug = 'donation-refund-policy';

    const page = await CmsPage.findOne({
      slug: { $regex: new RegExp(`^${requestedSlug}$`, 'i') },
      status: 'published'
    });

    if (!page) {
      console.log(`[CMS GET 404] Page slug "${requestedSlug}" not found or not published.`);
      return res.status(404).json({ error: 'This page is currently unavailable.' });
    }

    console.log(`[CMS GET SUCCESS] Serving page "${page.slug}", ID: ${page._id}, UpdatedAt: ${page.updatedAt}`);
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
