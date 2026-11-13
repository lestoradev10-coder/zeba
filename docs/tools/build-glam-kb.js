/* Builds js/glamai-kb.js from the website content (js/data.js + page copy).
   Run:  node tools/build-glam-kb.js   — re-run whenever packages / FAQs / copy change. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') +
  '\n;this.__D={PHONE,WA_NUMBER,EMAIL,GLAM_PACKAGES,HERO_INTRO,WORKFLOW,REASONS,ABOUT_STATS,STATS,WORKS,REVIEWS,FAQS,BLOG};';
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx);
const D = ctx.__D;

const txt = h => String(h)
  .replace(/<li>/g, '\n• ').replace(/<\/p>|<\/ul>|<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n[ ]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const pkgUrl = id => 'package.html?id=' + id;
const chunks = [];
const add = (k, p, t, h, x, alt) => { const c = { p, t, h, x: String(x).trim(), k }; if (alt) c.alt = alt; chunks.push(c); };

/* ---- FAQs from the site (shown in the FAQs tab) ---- */
D.FAQS.forEach(f => add('f', 'index.html#faq', 'FAQ', f.q, txt(f.a)));

/* ---- extra FAQs, every answer is taken from site copy / checkout / package pages ---- */
const price = D.GLAM_PACKAGES.map(p => '• ' + p.name + ' — ' + p.priceLabel).join('\n');
add('f', 'packages.html', 'FAQ', 'How much do your makeup packages cost?',
  'Our packages are priced as follows:\n' + price + '\n\nPackages marked “From” are starting prices — our team confirms the final quote with you.',
  ['What are your prices?', 'What is the price list?', 'How much does bridal makeup cost?', 'Makeup charges', 'rates']);
add('f', 'index.html#how', 'FAQ', 'How does booking work?',
  'Booking takes five simple steps:\n' + D.WORKFLOW.map(s => '• ' + s.n + ' ' + s.title + ' — ' + s.text).join('\n') + '\n\nYou can book a package online, or call / WhatsApp ' + D.PHONE + '.',
  ['How do I book?', 'How to book an appointment', 'Booking process', 'How it works', 'operational flow']);
add('f', 'checkout.html', 'FAQ', 'Does the artist come to my location?',
  'Yes. Our artists bring professional makeup artistry to your doorstep, and artist travel to you is included at checkout. We currently accept bookings in Hyderabad, Bangalore and Kochi.',
  ['Home service', 'Do you travel to the venue?', 'Do you come to my house?', 'doorstep service', 'travel charges']);
add('f', 'checkout.html', 'FAQ', 'What payment methods do you accept?',
  'At checkout you can pay by:\n• UPI — pay with any UPI app\n• Debit / Credit card — Visa, Mastercard, RuPay\n• Pay after service — pay the artist once your look is complete',
  ['How can I pay?', 'Is UPI accepted?', 'Can I pay cash?', 'payment options', 'card payment']);
add('f', 'index.html#why', 'FAQ', 'Which products do you use?',
  'We use only the finest products from trusted luxury brands — from Charlotte Tilbury to Dior and Tom Ford — so every product that touches your skin is chosen for quality, safety and a flawless finish. Note that the Signature Glam Makeup package uses standard products, while the Sangeet and bridal packages use professional / premium products.',
  ['What brands do you use?', 'Makeup brands', 'Do you use branded makeup?', 'premium products', 'HD makeup products']);
add('f', 'index.html#about', 'FAQ', 'How experienced is the team?',
  'Glam by Zebaish has over 10 years of experience, has styled 500+ brides, serves 3 cities and has a 100% client satisfaction record. Our artists are skilled and background-verified professionals.',
  ['How many years of experience?', 'Who is Zeba?', 'How many brides have you done?', 'Are your artists verified?', 'artist experience']);
add('f', 'packages.html', 'FAQ', 'Do you offer groom makeup and styling?',
  'Yes. The Royal Groom Styling package (from ₹2,499) includes groom makeup & skin finishing, hair styling, and beard grooming & setting for a premium, long-lasting look. It is perfect for wedding grooms, engagement ceremonies, reception events, traditional functions and photoshoots.',
  ['Groom makeup', 'Men grooming', 'Beard styling', 'Do you do makeup for men?']);
add('f', 'packages.html', 'FAQ', 'Which package is best for a bride?',
  'For brides we offer:\n• Bridal Signature Package — from ₹8,999 (premium bridal makeup, luxury hairstyling, saree/gown/dupatta setting, eyelashes, touch-up kit)\n• Reception Glam — from ₹8,999 (luxury skin prep, HD base, signature glam eyes, hairstyling, dupatta/veil draping)\n• Luxury Bridal Package — ₹80,000 (all-inclusive for bride & groom, with luxury nail services)\n• Sangeet Glam&Glow — ₹4,999 for the Sangeet ceremony\n\nNot sure which fits? Every bride gets a personalised consultation before we begin.',
  ['Bridal packages', 'Best package for wedding', 'wedding makeup', 'Nikah makeup', 'Hindu wedding makeup', 'Christian wedding makeup']);
add('f', 'index.html#faq', 'FAQ', 'Can I get a consultation before booking?',
  'Yes — every bride gets a personalised consultation before we begin. You can book a consultation through our Contact page, or call / WhatsApp ' + D.PHONE + '. Please note that we do not provide a makeup trial.',
  ['Free consultation', 'Talk to someone before booking', 'Book a consultation', 'speak to the artist']);
add('f', 'index.html#about', 'FAQ', 'What is the Sangeet Glam package?', txt(D.GLAM_PACKAGES.find(p => p.id === 'sangeet-glam').description) + ' Price: ₹4,999.',
  ['Sangeet makeup', 'Makeup for sangeet function']);

add('f', 'packages.html', 'FAQ', 'Do you provide hairstyling?',
  'Yes, hairstyling is part of every package:\n' + D.GLAM_PACKAGES.map(p => '• ' + p.name + ' — ' + (p.features.filter(f => /hair/i.test(f))[0] || 'hair styling')).join('\n'),
  ['hair styling', 'hairdo', 'Is hair included?', 'hair setting', 'hair and makeup']);
add('f', 'index.html#blog', 'FAQ', 'Do you have a blog with beauty tips?',
  'Yes — our latest articles:\n' + D.BLOG.map(b => '• ' + b.title + ' (' + b.cat + ')').join('\n') + '\n\nOpen the Articles tab in this chat to read them.',
  ['blog', 'articles', 'bridal skincare tips', 'beauty tips', 'makeup tips']);

/* ---- overview docs (supplementary) ---- */
add('d', '', 'Glam by Zebaish Knowledge Base', 'What is Glam by Zebaish?',
  'Glam by Zebaish is a professional makeup artistry service that brings bridal, party and groom makeup to your doorstep in Hyderabad, Bangalore and Kochi. With over 10 years of experience, it also creates meaningful career opportunities for talented women — empowering beauty, creating careers and building futures.\n\nServices: bridal makeup, reception glam, Sangeet glam, party (signature glam) makeup, groom styling and an all-inclusive luxury bridal package.',
  ['Tell me about Glam by Zebaish', 'Who are you?', 'What do you do?', 'What services do you provide?', 'About your company', 'about us', 'Who is Zebaish?']);
add('d', '', 'Glam by Zebaish Knowledge Base', 'How can I contact Glam by Zebaish?',
  '📞 Phone / WhatsApp: ' + D.PHONE + '\n📧 Email: ' + D.EMAIL + '\n📍 Hyderabad, Telangana (we serve Hyderabad, Bangalore and Kochi)\n📷 Instagram: @glambyzebaish',
  ['contact details', 'phone number', 'email address', 'whatsapp number', 'address', 'where are you located', 'Instagram']);
add('d', '', 'Glam by Zebaish Knowledge Base', 'Which cities do you serve?',
  'We currently accept bookings in Hyderabad, Bangalore and Kochi. Artists travel to your location.',
  ['Do you take bookings outside Hyderabad?', 'service areas', 'Do you serve Chennai?', 'locations', 'cities']);
add('d', '', 'Glam by Zebaish Knowledge Base', 'Do you offer a makeup trial?',
  'No, we do not provide a makeup trial. Every bride does get a personalised consultation before we begin.',
  ['trial makeup', 'makeup trial session', 'trial before wedding']);
add('d', '', 'Glam by Zebaish Knowledge Base', 'How do I become a makeup artist with Glam by Zebaish?',
  'Joining as a makeup artist is simple: visit the Artist Registration page, fill in your details, portfolio and ID proof, and submit your application for review. Once approved, log in to your artist dashboard to start accepting bookings. Glam by Zebaish also offers industry-standard training and a strong support network for artists.',
  ['artist registration', 'join as artist', 'job', 'career', 'become a makeup artist', 'artist login', 'training']);

/* ---- packages (one chunk each for description, inclusions and price) ---- */
D.GLAM_PACKAGES.forEach(p => {
  const u = pkgUrl(p.id);
  add('p', u, p.name, p.name, txt(p.description) + '\n\nPrice: ' + p.priceLabel + (p.from ? ' (starting price — final quote confirmed by our team)' : ' per booking') + '\nPerfect for: ' + p.perfect, [p.tag, p.word + ' makeup']);
  add('p', u, p.name, p.name + ' — what is included', 'Includes:\n' + p.features.map(f => '• ' + f).join('\n'));
});

/* ---- site sections ---- */
add('p', 'index.html#about', 'About us', 'Skilled hands, brighter futures',
  'With over 10 years of experience, we bring professional makeup artistry to your doorstep while creating meaningful career opportunities for talented women.\n\nGlam by Zebaish is more than just makeup — it’s a movement. We believe beauty is confidence, empowerment, and transformation. Our mission is to make professional beauty services accessible while building the next generation of skilled makeup artists.\n\nThrough industry-standard training, premium products, and a strong support network, we are committed to setting new standards of excellence in the beauty industry.\n' + D.ABOUT_STATS.map(s => '• ' + s[0] + s[1] + ' ' + s[2]).join('\n'));
D.REASONS.forEach(r => add('p', 'index.html#why', 'Why choose us', r.title, r.text));
D.WORKFLOW.forEach(s => add('p', 'index.html#how', 'How it works', 'Step ' + s.n + ': ' + s.title, s.text));
D.WORKS.forEach(w => add('p', 'index.html#works', 'Our works', w.title, w.text + '\nPackage: ' + D.GLAM_PACKAGES.find(p => p.id === w.pkg).name));
D.REVIEWS.forEach(r => add('l', 'index.html#reviews', 'Client reviews', 'Review by ' + r.name, r.text));
D.BLOG.forEach(b => add('b', b.href, b.title, b.title, b.cat + ' · ' + b.date));

const KB = {
  chunks,
  programs: D.GLAM_PACKAGES.map(p => ({ t: p.name, u: pkgUrl(p.id), d: p.tag + ' · ' + p.priceLabel, img: 'images/' + p.image })),
  partners: [],
  articles: D.BLOG.map(b => ({ u: b.href, t: b.title, d: b.cat + ' · ' + b.date }))
};
fs.writeFileSync(path.join(root, 'js/glamai-kb.js'),
  '/* Glam AI knowledge base — generated from the Glam by Zebaish site content. Do not edit by hand; run: node tools/build-glam-kb.js */\nwindow.GLAMAI_KB=' + JSON.stringify(KB) + ';\n');
const c = {}; chunks.forEach(x => c[x.k] = (c[x.k] || 0) + 1);
console.log('chunks', chunks.length, c, 'packages', KB.programs.length, 'articles', KB.articles.length);
