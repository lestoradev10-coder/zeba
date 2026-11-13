# Glam AI chatbot (same design & logic as ASQIVO)

New files
- `js/glamai.js`          widget (UI + conversation logic, identical behaviour to ASQIVO)
- `js/glamai-engine.js`   knowledge-base search engine (answers ONLY from the KB)
- `js/glamai-kb.js`       knowledge base (generated)
- `css/glamai.css`        widget styles (Glam purple palette: change the `--b1/--b2/--gold` variables at the top)
- `images/glam-ai-avatar.webp`  chatbot profile picture (cropped from your illustration)
- `images/glam-ai-empty.webp`   illustration for the empty "Conversation" tab
- `tools/build-glam-kb.js`      rebuilds `js/glamai-kb.js` from `js/data.js`

Changed files
- All 6 HTML pages: include `css/glamai.css`, `js/glamai-engine.js`, `js/glamai.js`
- `js/app.js` / `css/style.css`: old "Glam AI" chat box + "Chat with us" pill removed

Behaviour
- Launcher is a round chat-bubble icon button (bottom-right, lifted above the sticky "Add to cart" bar on package pages on mobile).
- If a question is not covered by the knowledge base the bot says it is "not confident enough" and offers WhatsApp / Email / Call
  (pre-filled with the visitor's question) plus a "Book a consultation" option.
- Tabs: Home, Conversation history, FAQs, Articles. Mic input, mute, new/end chat, thumbs rating — same as ASQIVO.
- Booking flow (name, mobile, city, package, date, people, notes) -> review -> opens a pre-filled WhatsApp / email message.
  (The Glam site has no backend, so the request is handed over via WhatsApp/email instead of an API call.)

Updating answers: edit `js/data.js` (packages, FAQs, blog) or the extra FAQs in `tools/build-glam-kb.js`, then run
`node tools/build-glam-kb.js` and bump the `?v=` on `glamai-kb.js` / `glamai.js` if you use caching.
