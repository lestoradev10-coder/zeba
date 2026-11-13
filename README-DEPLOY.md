# Glam by Zebaish — deployment-ready project

Next.js backend (`app/api`, `prisma`, `lib`) with the new beauty-design website in `public/`.
The backend, API routes, database schema and payment code are the same as Zeba-main.

## Deploy (Vercel)
1. Push this folder to your Git repo (or `vercel --prod`).
2. Add the environment variables listed in `.env.example` (use the same values as the current Zeba-main project).
3. Build command / install command are already set in `vercel.json`
   (`npx prisma generate && npx next build`, `npm install --legacy-peer-deps`).
4. Clean URLs work as before: `/login`, `/dashboard`, `/blog`, `/hd-bridal-makeup` ...

## Pages (public/)
Home, About, Packages, Package detail, Blog + 3 posts, Iconic Brides, Contact, Privacy, Terms,
Login / Register / Forgot / Reset (customer + artist), Book now, Checkout, Booking confirmation,
Customer dashboard, Artist dashboard, Admin + Artist-admin login and dashboards.

## Notes
- CSS/JS are linked with `?v=13`; bump the number in the HTML when you change css/js files.
  css/js cache is 1 hour (`vercel.json`) so updates show up quickly.
- The HD Bridal Makeup post image is the Unsplash photo from Zeba-main (`images.unsplash.com` is allowed in `vercel.json`).
- Change history: `docs/CHANGE-NOTES.txt`. Chatbot knowledge builder: `docs/tools/`.
