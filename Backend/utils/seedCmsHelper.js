const CmsPage = require('../model/CmsPage');

const CANONICAL_LEGAL_PAGES = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    metaTitle: 'Privacy Policy - Swasti Foundation',
    metaDescription: 'Read the Privacy Policy of Swasti Foundation regarding personal data collection, payment security via Razorpay, cookies, and data protection rights.',
    status: 'published',
    content: `
      <h2>Privacy Policy</h2>
      <p>At <strong>Swasti Foundation</strong>, protecting your privacy is one of our highest priorities.</p>
      
      <h3>Information We Collect</h3>
      <p>We may collect personal information such as Name, Email Address, Mobile Number, and Donation Details when you interact with our website.</p>

      <h3>How We Use Your Information</h3>
      <p>Your information is used strictly to process donations securely, issue official receipts, and respond to support inquiries.</p>

      <h3>Payment Security</h3>
      <p>All online payments are securely processed through <strong>Razorpay</strong>. Swasti Foundation does not store banking or credit card details.</p>

      <h3>Contact Us</h3>
      <p>If you have any questions regarding this Privacy Policy, please email us at <a href="mailto:foundationswasti@gmail.com">foundationswasti@gmail.com</a>.</p>
    `
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    metaTitle: 'Terms & Conditions - Swasti Foundation',
    metaDescription: 'Terms and conditions governing the use of Swasti Foundation website and voluntary charitable contributions.',
    status: 'published',
    content: `
      <h2>Terms & Conditions</h2>
      <p>By accessing this website or making a donation, you agree to comply with and be bound by the following terms and conditions.</p>

      <h3>Donations</h3>
      <p>All donations made through this website are voluntary contributions made to support the charitable objectives and community welfare initiatives of Swasti Foundation.</p>

      <h3>Use of Funds</h3>
      <p>Donations will be utilized towards charitable initiatives, operational expenses, field projects, and community development based on organizational priorities.</p>

      <h3>Tax Benefits</h3>
      <p>Tax exemption benefits, if applicable, shall be provided only in accordance with prevailing Indian laws under section 80G of the Income Tax Act.</p>

      <h3>Changes to Terms</h3>
      <p>These Terms & Conditions may be updated from time to time without prior notice.</p>
    `
  },
  {
    title: 'Donation Refund Policy',
    slug: 'donation-refund-policy',
    metaTitle: 'Donation Refund Policy - Swasti Foundation',
    metaDescription: 'Swasti Foundation policy regarding donation refunds, accidental payments, and request review timelines.',
    status: 'published',
    content: `
      <h2>Donation Refund Policy</h2>
      <p>Swasti Foundation greatly appreciates the generosity and commitment of our donors to support underserved communities.</p>

      <h3>General Policy</h3>
      <p>Donations made to Swasti Foundation are voluntary contributions and are generally considered non-refundable once processed.</p>

      <h3>Accidental or Erroneous Donations</h3>
      <p>If a donation has been made unintentionally or due to a payment processing error, the donor may submit a written refund request within <strong>7 days</strong> of the transaction date.</p>

      <h3>Refund Review & Timeline</h3>
      <p>Once approved, refunds will be processed back to the original payment method within <strong>7 to 10 business days</strong>.</p>
    `
  },
  {
    title: 'Disclaimer',
    slug: 'disclaimer',
    metaTitle: 'Disclaimer - Swasti Foundation',
    metaDescription: 'General disclaimer statement regarding website information accuracy, third-party links, and liability.',
    status: 'published',
    content: `
      <h2>Disclaimer</h2>
      <p>The information provided on this website is intended for general informational, educational, and awareness purposes only.</p>

      <p>Swasti Foundation makes every effort to ensure that the information published is accurate and up to date, but makes no express or implied warranties regarding its absolute completeness.</p>
    `
  },
  {
    title: 'Contact Us',
    slug: 'contact',
    metaTitle: 'Contact Us - Swasti Foundation',
    metaDescription: 'Get in touch with Swasti Foundation for general inquiries, volunteer opportunities, or donation support.',
    status: 'published',
    content: `
      <h2>Get In Touch</h2>
      <p>We welcome your questions, feedback, and support. Reach out to Swasti Foundation using the details on our contact page.</p>
    `
  }
];

async function initializeCmsPages() {
  console.log('\nCMS initialization started...');
  try {
    // 1. Ensure unique index on 'slug' is created at MongoDB level
    await CmsPage.createIndexes();

    // 2. Remove legacy non-canonical alias documents (terms, refund-policy)
    await CmsPage.deleteMany({ slug: { $in: ['terms', 'refund-policy'] } });

    // 3. Deduplication migration: Group documents by slug and delete duplicates, retaining the newest
    for (const pageData of CANONICAL_LEGAL_PAGES) {
      const duplicates = await CmsPage.find({ slug: pageData.slug }).sort({ updatedAt: -1 });
      if (duplicates.length > 1) {
        const [keeper, ...toDelete] = duplicates;
        const deleteIds = toDelete.map((d) => d._id);
        await CmsPage.deleteMany({ _id: { $in: deleteIds } });
        console.log(`🧹 Cleaned up ${deleteIds.length} duplicate document(s) for slug: "${pageData.slug}"`);
      }
    }

    // 4. Atomic Upsert for ONLY the 5 canonical pages
    for (const pageData of CANONICAL_LEGAL_PAGES) {
      await CmsPage.findOneAndUpdate(
        { slug: pageData.slug },
        { $setOnInsert: pageData },
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
      const logTitle = pageData.slug === 'contact' ? 'Contact' : pageData.title;
      console.log(`${logTitle} ✓`);
    }

    console.log('CMS initialization complete.\n');
  } catch (err) {
    console.error('❌ CMS initialization failed:', err.message);
  }
}

module.exports = initializeCmsPages;
