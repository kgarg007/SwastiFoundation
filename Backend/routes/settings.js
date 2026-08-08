const express = require('express');
const fs = require('fs');
const Settings = require('../model/settings');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const uploadOnCloudinary = require('../utils/fileUpload');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();

// GET settings (Public) - Auto-initializes if empty
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update settings (Protected)
router.put('/', auth, upload.single('founderImage'), async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    let { orgInfo, aboutContent, founderMessage, impactStats } = req.body;

    // Handle parsed JSON fields if they are sent as JSON strings in multipart
    if (typeof orgInfo === 'string') {
      try { orgInfo = JSON.parse(orgInfo); } catch (e) {}
    }
    if (typeof aboutContent === 'string') {
      try { aboutContent = JSON.parse(aboutContent); } catch (e) {}
    }
    if (typeof founderMessage === 'string') {
      try { founderMessage = JSON.parse(founderMessage); } catch (e) {}
    }
    if (typeof impactStats === 'string') {
      try { impactStats = JSON.parse(impactStats); } catch (e) {}
    }

    // 1. Direct JSON structures
    if (orgInfo) {
      settings.orgInfo = { ...settings.orgInfo, ...orgInfo };
    }
    if (aboutContent) {
      settings.aboutContent = { ...settings.aboutContent, ...aboutContent };
    }
    if (founderMessage) {
      settings.founderMessage = { ...settings.founderMessage, ...founderMessage };
    }
    if (impactStats) {
      settings.impactStats = impactStats;
    }

    // 2. Flat Form Data structures (as backup for multipart forms)
    const {
      org_name, org_tagline, org_taglineTrans, org_foundedDate, org_foundedYear,
      org_registeredAt, org_type, org_address, org_email, org_phone, org_whatsapp,
      social_fb, social_ig, social_yt,
      about_whyFounded, about_problem, about_founderStory, about_inspiration,
      about_mission, about_vision, about_visionExtended,
      founder_name, founder_title, founder_closing, founder_letter
    } = req.body;

    if (!orgInfo && org_name !== undefined) {
      settings.orgInfo = {
        name: org_name,
        tagline: org_tagline,
        taglineTranslation: org_taglineTrans,
        foundedDate: org_foundedDate,
        foundedYear: parseInt(org_foundedYear) || 2020,
        registeredAt: org_registeredAt,
        type: org_type,
        officeAddress: org_address,
        email: org_email,
        phone: org_phone,
        whatsappNumber: org_whatsapp,
        social: {
          facebook: social_fb,
          instagram: social_ig,
          youtube: social_yt
        }
      };
    }

    if (!aboutContent && about_whyFounded !== undefined) {
      settings.aboutContent = {
        ...settings.aboutContent,
        whyFounded: about_whyFounded,
        problem: about_problem,
        founderStory: about_founderStory,
        inspiration: about_inspiration,
        mission: about_mission,
        vision: about_vision,
        visionExtended: about_visionExtended,
      };
    }

    if (!founderMessage && founder_name !== undefined) {
      let letterParagraphs = [];
      if (typeof founder_letter === 'string') {
        letterParagraphs = founder_letter.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
      } else if (Array.isArray(founder_letter)) {
        letterParagraphs = founder_letter;
      }

      settings.founderMessage = {
        ...settings.founderMessage,
        founderName: founder_name,
        founderTitle: founder_title,
        letter: letterParagraphs,
        closing: founder_closing,
        founderImage: settings.founderMessage?.founderImage,
        imagePublicId: settings.founderMessage?.imagePublicId
      };
    }

    if (!impactStats) {
      const parsedImpact = [];
      const statIds = ["children-educated", "ration-distributed", "states-reached", "cleanliness-kits"];
      for (const id of statIds) {
        if (req.body[`impact_${id}_label`] !== undefined) {
          parsedImpact.push({
            id,
            label: req.body[`impact_${id}_label`],
            value: parseInt(req.body[`impact_${id}_value`]) || 0,
            suffix: req.body[`impact_${id}_suffix`] || '+'
          });
        }
      }
      if (parsedImpact.length > 0) {
        settings.impactStats = parsedImpact;
      }
    }

    // 3. Handle founderImage file upload
    if (req.file) {
      const cloudinaryRes = await uploadOnCloudinary(req.file.path);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (!cloudinaryRes || cloudinaryRes === "Error Occured") {
        return res.status(500).json({ error: 'Failed to upload founder image to Cloudinary.' });
      }

      if (settings.founderMessage && settings.founderMessage.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(settings.founderMessage.imagePublicId);
        } catch (e) {
          console.error("Failed to delete old founder image:", e);
        }
      }

      if (!settings.founderMessage) {
        settings.founderMessage = {};
      }
      settings.founderMessage.founderImage = cloudinaryRes.secure_url || cloudinaryRes.url;
      settings.founderMessage.imagePublicId = cloudinaryRes.public_id;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

