/* Glam by Zebaish — catalog + shared content (all copy taken from the Zeba site) */
const PHONE = "+91 9505777790";
const WA_NUMBER = "919505777790";
const EMAIL = "hello@glambyzebaish.com";
const WA_LINK = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent("Hi Glam by Zeba, I'd like to book a makeup service!");

const GLAM_PACKAGES = [
  {
    id: "basic-makeup", name: "Signature Glam Makeup", tag: "Signature glam", word: "Signature",
    image: "basic.webp", banner: "signature-glam4-slider.webp", bannerMobile: "signature-glam4-mobile.webp",
    price: 2999, priceLabel: "₹2,999", from: false, category: "party", pos: "right center",
    short: "A full-face party makeup look built around fresh skin prep, defined eyes and lips, soft hairstyling and a finish that stays put through the night.",
    heroTitle: "Signature <b>glam</b> makeup",
    description: "Full-face party makeup with skin preparation and base makeup, eye makeup with lashes (if required), lip makeup, basic hairstyling, and makeup setting for longer wear. Standard products are used in this package.",
    features: ["Full-face party makeup","Skin preparation and base makeup","Eye makeup with lashes (if required)","Lip makeup","Basic hairstyling","Makeup setting for longer wear"],
    perfect: "Parties, celebrations and any evening you want to look polished."
  },
  {
    id: "sangeet-glam", name: "Sangeet Glam&Glow", tag: "Sangeet ready", word: "Sangeet",
    image: "sang.webp", banner: "sangeeth5-slider.webp", bannerMobile: "sangeeth5-mobile.webp",
    price: 4999, priceLabel: "₹4,999", from: false, category: "party", pos: "right center",
    short: "An elegant, festive look designed for brides, bridesmaids and family alike, made to carry you gracefully through an entire night of celebration.",
    heroTitle: "Sangeet <b>glam</b> &amp; glow",
    description: "Full-face makeup using professional products, skin preparation and base application, eye makeup with lashes, lip makeup, basic hairstyle/styling, and makeup setting for enhanced longevity. Perfect for brides, bridesmaids, sisters, and family members who want an elegant and festive look for the Sangeet ceremony.",
    features: ["Full-face makeup using professional products","Skin preparation and base application","Eye makeup with lashes","Lip makeup","Basic hairstyle/styling","Makeup setting for enhanced longevity"],
    perfect: "Brides, bridesmaids, sisters and family at the Sangeet ceremony."
  },
  {
    id: "royal-groom", name: "Royal Groom Styling", tag: "For the groom", word: "Groom",
    image: "groom.webp", banner: "royal-groom6-slider.webp", bannerMobile: "royal-groom6-mobile.webp",
    price: 2499, priceLabel: "From ₹2,499", from: true, category: "groom", pos: "right center",
    short: "Clean makeup and skin finishing paired with sharp hair styling and beard grooming, for a premium look that photographs beautifully and lasts all day.",
    heroTitle: "Royal <b>groom</b> styling",
    description: "Perfect for wedding grooms, engagement ceremonies, reception events, traditional functions, and photoshoots. Includes groom makeup and skin finishing, hair styling, and beard grooming and setting for a premium, long-lasting look.",
    features: ["Groom Makeup & Skin Finishing","Hair Styling","Beard Grooming & Setting","Premium Long-lasting Look"],
    perfect: "Wedding grooms, engagements, receptions, traditional functions and photoshoots."
  },
  {
    id: "sangeet-reception", name: "Reception Glam", tag: "Reception night", word: "Reception",
    image: "reception.webp", banner: "reception6-slider.webp", bannerMobile: "reception6-mobile.webp",
    price: 8999, priceLabel: "From ₹8,999", from: true, category: "bridal", pos: "right center",
    short: "A luxurious, bespoke beauty experience curated for the bride who wants to glow, captivate the room and leave a lasting impression all evening long.",
    heroTitle: "Reception <b>glam</b> night",
    description: "A luxurious, bespoke beauty experience curated for the bride who wants to glow, captivate & leave a lasting impression.",
    features: ["Luxury Skin Prep","Flawless HD / Luxury Base","Sculpted & Radiant Complexion","Signature Glam Eyes","Wispy Lashes","Bespoke Lip Look","Soft Contour & Luminous Highlight","Long-Wear, Camera-Ready Finish","Luxury Hairstyling Included","Dupatta / Veil Draping & Setting"],
    perfect: "The bride who wants to glow and captivate at the reception."
  },
  {
    id: "bridal-signature", name: "Bridal Signature Package", tag: "The big day", word: "Bridal",
    image: "bride.webp", banner: "slider7-bride.webp", bannerMobile: "slider7-bride-mobile.webp",
    price: 8999, priceLabel: "From ₹8,999", from: true, category: "bridal", pos: "left center",
    short: "A complete bridal transformation featuring premium bridal makeup, luxury hairstyling, traditional draping and every finishing detail in between.",
    heroTitle: "Bridal <b>signature</b> package",
    description: "Perfect for Hindu weddings, Christian weddings, Nikah ceremonies, and traditional & destination weddings. Complete bridal transformation with premium bridal makeup, luxury hairstyling, saree/gown/dupatta setting, eyelashes, a touch-up kit, and complete bridal finishing.",
    features: ["Premium Bridal Makeup","Luxury Hairstyling","Saree/Gown/Dupatta Setting","Eyelashes","Touch-up Kit","Complete Bridal Finishing"],
    perfect: "Hindu weddings, Christian weddings, Nikah ceremonies, traditional & destination weddings."
  },
  {
    id: "luxury-bridal", name: "Luxury Bridal Package", tag: "All-inclusive bridal", word: "Luxury",
    image: "luxury-bridal.webp", banner: "luxury-bridal-slider.webp", bannerMobile: "luxury-bridal-mobile.webp",
    price: 80000, priceLabel: "₹80,000", from: false, category: "bridal", pos: "right center",
    short: "An all-inclusive bridal experience designed for the bride and groom, with premium bridal makeup, luxury nail services, bridal hairstyling, professional draping and complete bridal glam styling.",
    heroTitle: "Luxury <b>bridal</b> package",
    description: "An all-inclusive bridal experience designed for the bride & groom. Includes premium bridal makeup, luxury nail services, bridal hairstyling, professional draping and dupatta setting, and complete bridal glam styling.",
    features: ["Premium Bridal Makeup","Luxury Nail Services","Bridal Hairstyling","Professional Draping & Dupatta Setting","Complete Bridal Glam Styling"],
    perfect: "The bride and groom who want a complete, all-inclusive experience."
  }
];
function getPackageById(id) { return GLAM_PACKAGES.find(p => p.id === id); }

const HERO_INTRO = [
  { tag: "Empowering women", title: "Beauty that <b>inspires</b> and transforms", text: "Empowering women through beauty, creating meaningful careers, and building brighter futures—Glam by Zebaish is where passion meets purpose.", banner: "hero1-slider.webp", mobile: "hero1-mobile.webp", pos: "right center" },
  { tag: "Crafted by experts", title: "Expert hands, flawless <b>detail</b>", text: "Every look is shaped by skilled artists who bring professional technique and an unhurried, attentive touch to each ceremony, from the first prep step to the final finishing detail.", banner: "hero2-slider.webp", mobile: "hero2-mobile.webp", pos: "right center" },
  { tag: "Premium products", title: "Only the <b>finest</b> touches your skin", text: "We use only the finest products from trusted luxury brands, so every product that touches your skin is chosen for quality, safety and a flawless finish.", banner: "hero3-slider.webp", mobile: "hero3-mobile.webp", pos: "right center" }
];

const WORKFLOW = [
  { n: "01", title: "Booking", text: "Book your appointment online in just a few clicks.", img: "how-booking.webp" },
  { n: "02", title: "Artist assigned", text: "Nearest & most suitable artist assigned to you.", img: "how-artist.webp" },
  { n: "03", title: "On the way", text: "Artist accepts and navigates to your location.", img: "how-onway.webp" },
  { n: "04", title: "Service", text: "Professional makeup service at your doorstep.", img: "how-service.webp" },
  { n: "05", title: "Complete", text: "Service completed & feedback collected.", img: "how-complete.webp" }
];

const REASONS = [
  { icon: "eye", title: "A vision for every face", img: "why-vision.webp", text: "Every look is crafted to honour your features and personality — never templated, always tailored." },
  { icon: "gem", title: "Only the finest products", img: "why-products.webp", text: "From Charlotte Tilbury to Dior and Tom Ford — your skin touches nothing but the best." },
  { icon: "camera", title: "Camera-ready perfection", img: "why-camera-ready.webp", text: "Every finish is designed to look flawless from the mandap to the last candid." },
  { icon: "clock", title: "Calm, composed & on time", img: "m2.webp", text: "We bring a composed, unhurried presence to your wedding morning — so you can simply enjoy it." },
  { icon: "heart", title: "500+ brides, countless memories", img: "why-bride.webp", text: "Hundreds of brides across Hyderabad have trusted us with their most important look." },
  { icon: "sparkle", title: "Your style, elevated", img: "why-style.webp", text: "We listen, we understand, and we create — always you, just your most beautiful self." }
];
const ABOUT_STATS = [[10, "+", "Years of experience"], [500, "+", "Brides styled"], [3, "", "Cities served"], [100, "%", "Client satisfaction"]];
const STATS = [["500+", "Happy clients"], ["10+", "Years experience"], ["100%", "Satisfaction"]];

const WORKS = [
  { img: "works-saree-bride.webp", title: "The traditional bride", text: "Premium bridal makeup with a complete, camera-ready finish.", pkg: "bridal-signature", chips: ["Bridal makeup", "Hairstyling", "Finishing"] },
  { img: "a2.webp", title: "Soft veil glow", text: "A luminous base, wispy lashes and a bespoke lip look.", pkg: "sangeet-reception", chips: ["HD base", "Lashes", "Lip look"] },
  { img: "a3.webp", title: "Bridal glam", text: "Sculpted, radiant skin with full bridal styling and draping.", pkg: "luxury-bridal", chips: ["Bridal makeup", "Nails", "Draping"] },
  { img: "works-red-lehenga.webp", title: "The festive bride", text: "Elegant makeup and hair styling for the whole celebration.", pkg: "sangeet-glam", chips: ["Full-face", "Lashes", "Styling"] },
  { img: "b1.webp", title: "Colour & jewels", text: "Defined eyes and a lasting finish for a wedding-ready look.", pkg: "bridal-signature", chips: ["Eyes", "Lips", "Setting"] },
  { img: "b2.webp", title: "Evening glow", text: "A party look that stays put through the night.", pkg: "basic-makeup", chips: ["Skin prep", "Eyes", "Lips"] }
];

const REVIEWS = [
  { name: "Priya Sharma", img: "test1.webp", text: "Absolutely loved my bridal makeup! Zeba and her team made me feel like a princess. The look was flawless and lasted all night. Highly recommend!" },
  { name: "Ananya Reddy", img: "test2.webp", text: "The best decision I made for my wedding! The team was so professional and made me feel so comfortable. My makeup was absolutely stunning!" },
  { name: "Meera Iyer", img: "test3.webp", text: "Glam by Zebaish is a blessing! The attention to detail and the quality of products used was top-notch. My skin felt amazing and looked radiant." },
  { name: "Sneha Patel", img: "test4.webp", text: "From our very first conversation to the final look, everything was perfect. Zeba understood exactly what I wanted and delivered beyond my expectations!" },
  { name: "Kavya Nair", img: "test5.webp", text: "I've never felt more beautiful! The team at Glam by Zebaish is incredibly talented and made my wedding day truly magical. Thank you!" },
  { name: "Ritika Singh", img: "test6.webp", text: "Every bride deserves this kind of experience. The makeup was flawless, the team was punctual, and the energy was just amazing!" }
];

const FAQS = [
  { q: "Why choose Glam by Zebaish?", a: "<p>Glam by Zebaish brings together <b>experienced, verified makeup artists</b>, premium products, and a hassle-free online booking experience.</p><ul><li>Skilled, background-verified professional artists</li><li>Transparent packages with clear pricing</li><li>Easy online booking and secure payments</li><li>Personalized looks for bridal, party, and grooming needs</li><li>Dedicated support before and after your appointment</li></ul>" },
  { q: "How can I contact you?", a: "<p>You can reach us for any enquiry or booking through the website, or directly at <b>+91 9505777790</b>.</p><ul><li>Call or WhatsApp us at +91 9505777790</li><li>Fill out the form on our <a href=\"#contact\">Contact Us</a> section</li><li>Use the chat widget on the website for quick questions</li><li>Follow and message us on <a href=\"https://www.instagram.com/glambyzebaish\" target=\"_blank\" rel=\"noopener\">Instagram</a> or <a href=\"https://www.facebook.com/people/Glam-by-Zebaish/61594240403449/\" target=\"_blank\" rel=\"noopener\">Facebook</a></li></ul>" },
  { q: "How do I register as an artist?", a: "<p>Joining Glam by Zebaish as a makeup artist is simple:</p><ul><li>Visit our <a href=\"artist-register.html\">Artist Registration</a> page</li><li>Fill in your details, portfolio, and ID proof</li><li>Submit your application for review</li><li>Once approved, log in to your artist dashboard to start accepting bookings</li></ul><p>Need help? Reach out to us at +91 9505777790 for enquiry and booking support.</p>" },
  { q: "Do you take bookings outside Hyderabad?", a: "<p>Currently, we are accepting bookings in <b>Hyderabad, Bangalore and Kochi</b>.</p><p>For any enquiry or booking through the website, contact us at +91 9505777790.</p>" },
  { q: "Are you providing a makeup trial?", a: "<p>No, we do not provide a makeup trial.</p>" },
  ...GLAM_PACKAGES.map(p => ({
    q: "What is included in the " + p.name + (p.id === "bridal-signature" ? "" : " package") + "?",
    a: "<p>The <b>" + p.name + "</b> (" + p.priceLabel.toLowerCase().replace("from ", "from ") + ") includes:</p><ul>" + p.features.map(f => "<li>" + f + "</li>").join("") + "</ul><p>" + p.perfect + "</p>"
  }))
];

const BLOG = [
  { cat: "Hair & Makeup", title: "Everything You Need To Know About HD Bridal Makeup", date: "July 1, 2026", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&crop=center", href: "hd-bridal-makeup.html" },
  { cat: "Skincare", title: "The Best Bridal Skincare Prep Guide for Your Big Day", date: "July 1, 2026", img: "skincarep.webp", href: "bridal-skincare-prep.html" },
  { cat: "Bridal Makeup", title: "5 Common Bridal Makeup Mistakes to Avoid", date: "July 1, 2026", img: "bridal.webp", href: "bridal-makeup-mistakes.html" }
];

const INSTA = ["ins1.webp", "ins2.webp", "ins3.webp", "ins4.webp", "ins5.webp", "ins6.webp", "b1.webp", "b2.webp", "b3.webp"];

/* Big scrolling words */
const WORDS = [
  { word: "Feel", cut: "lip-tint--fig.png" },
  { word: "Beautiful.", cut: "cheek-tint.png", end: true },
  { word: "Look", cut: "skin-tint.png" },
  { word: "Radiant.", cut: "mascara.png", end: true },
  { word: "Shine", cut: "lip-tint--coral.png" },
  { word: "Uniquely.", cut: "lip-tint-case.png", end: true }
];
