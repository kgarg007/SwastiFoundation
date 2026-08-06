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
<h1>Donation Refund Policy</h1>
<p><strong>Effective Date:</strong> 30 July 2026<br>
<strong>Last Updated:</strong> 30 July 2026</p>
<p>Swasti Foundation sincerely appreciates the generosity and trust of every donor who supports our mission of empowering underserved communities through education, healthcare, environmental sustainability, livelihood development, and community welfare.</p>
<p>As a registered non-profit organization, every contribution received is utilized to support our charitable initiatives. Therefore, donations are generally treated as voluntary contributions and are non-refundable.</p>
<hr>
<h2>1. General Refund Policy</h2>
<p>All donations made to Swasti Foundation are voluntary and are considered final once successfully processed through our payment gateway.</p>
<p>We encourage donors to carefully verify the donation amount and payment details before completing the transaction.</p>
<hr>
<h2>2. Accidental or Duplicate Donations</h2>
<p>If a donation has been made:</p>
<ul>
<li>Accidentally,</li>
<li>More than once for the same transaction,</li>
<li>Due to an unintentional payment processing error,</li>
</ul>
<p>the donor may request a refund by contacting us within <strong>7 days</strong> of the transaction date.</p>
<p>Each request will be reviewed individually before approval.</p>
<hr>
<h2>3. Refund Eligibility</h2>
<p>Refund requests may be considered under the following circumstances:</p>
<ul>
<li>Duplicate payment.</li>
<li>Incorrect donation amount caused by technical error.</li>
<li>Payment deducted multiple times.</li>
<li>Unauthorized transaction reported by the donor.</li>
</ul>
<p>Swasti Foundation reserves the right to request supporting information before processing any refund.</p>
<p style="margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.08); border-left: 4px solid #dc2626; border-radius: 4px; line-height: 1.5;"><strong>IMPORTANT: A refund may be requested within 48 hours from the time of a successful donation/payment. Any refund request submitted after the 48-hour window will not be processed, as the funds are automatically settled and transferred to the organization's bank account in accordance with the payment gateway's settlement process.</strong></p>
<hr>
<h2>4. Non-Refundable Donations</h2>
<p>Refunds will generally <strong>not</strong> be provided for:</p>
<ul>
<li>Donations made voluntarily.</li>
<li>Donations made after the funds have already been allocated to charitable programs.</li>
<li>Donations where incorrect information was entered by the donor without any payment gateway error.</li>
<li>Anonymous donations where the transaction cannot be verified.</li>
</ul>
<hr>
<h2>5. Refund Processing Time</h2>
<p>If a refund request is approved:</p>
<ul>
<li>The refund will be processed to the original payment method.</li>
<li>Processing may take <strong>7–10 business days</strong>, depending on your bank or payment provider.</li>
</ul>
<p>Swasti Foundation is not responsible for delays caused by banking institutions or payment gateways.</p>
<hr>
<h2>6. How to Request a Refund</h2>
<p>To request a refund, please email us with the following information:</p>
<ul>
<li>Donor Name</li>
<li>Registered Email Address</li>
<li>Mobile Number</li>
<li>Donation Amount</li>
<li>Date of Donation</li>
<li>Transaction ID / Razorpay Payment ID</li>
<li>Reason for Refund Request</li>
</ul>
<p><strong>Email:</strong> <a class="decorated-link cursor-pointer">foundationswasti@gmail.com</a></p>
<hr>
<h2>7. Cancellation Policy</h2>
<p>Since donations are processed immediately after confirmation, they cannot be cancelled once successfully completed.</p>
<p>If a payment has been made in error, please submit a refund request following the procedure described above.</p>
<hr>
<h2>8. Contact Us</h2>
<p>If you have any questions regarding this Donation Refund Policy, please contact us:</p>
<p><strong>Swasti Foundation</strong><br>
📧 Email: <a class="decorated-link cursor-pointer">foundationswasti@gmail.com</a></p>
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
