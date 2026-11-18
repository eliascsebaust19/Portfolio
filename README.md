# Elias Ahmad — Interactive 3D Developer Portfolio

Personal developer portfolio for **Elias Ahmad**, Computer Science and Engineering (CSE) student at **Bangladesh Army University of Science and Technology (BAUST)**.

Built with React 18, TypeScript, Vite, Three.js / React Three Fiber, Drei, GSAP ScrollTrigger, and Tailwind CSS — using 100% open-source dependencies.

---

## Key Features

- **Cinematic Hero & 3D Avatar Stage (`/models/elias-avatar.glb`)**:
  - Ready for a realistic GLB human avatar via React Three Fiber + Drei `useGLTF` (Draco-enabled).
  - Supports embedded idle animations, smart head/neck bone detection for pointer tracking, and responsive camera framing.
  - Displays an honest static fallback and interactive 3D calibration stage until `/models/elias-avatar.glb` is placed in `public/models/`.
- **GSAP + ScrollTrigger Animation System**:
  - Staggered hero reveals, dynamic role text cycling, scroll-triggered section entrances, and an animated vertical timeline rail.
  - Automatically respects `prefers-reduced-motion` and disables custom desktop cursor on mobile/touch devices.
- **Interactive Technologies Showcase**:
  - Categorized by domain (`Frontend`, `Backend`, `Database`, `Development Tools`, `APIs`) and honest proficiency stage (`Learning`, `Practicing`, `Familiar With`).
  - Interactive 3D orbiting technology nodes synchronized with filterable cards.
- **Centralized Project Showcase (`src/data/projects.ts`)**:
  - Configured initially with 2 clearly labeled demo placeholders and an accessible Project Detail modal.
- **Live GitHub Integration**:
  - Fetches public profile details and repositories from `https://api.github.com/users/eliascsebaust19` with loading skeletons, session caching, and error retry states (no exposed tokens).
- **Functional Contact Form (`/api/contact`)**:
  - Includes client & server validation, honeypot spam trap, timing check, rate limiting, and Resend / Formspree delivery support via environment variables.
- **Technical SEO**:
  - Semantic HTML5 landmarks, Open Graph & Twitter Cards, JSON-LD `Person` structured data, `public/robots.txt`, and `public/sitemap.xml`.

---

## Adding Your 3D Avatar Model

1. Export or place your realistic GLB model at:
   ```
   public/models/elias-avatar.glb
   ```
2. Recommended: Draco-compress the GLB (`< 5 MB`) with the avatar facing `+Z`.
3. The app automatically detects `/models/elias-avatar.glb` at runtime and switches from the fallback stage to your 3D character.

---

## Replacing Demo Projects

Edit `src/data/projects.ts` to replace the 2 initial demo placeholders with your finalized projects, screenshots (`public/images/projects/`), GitHub links, and live deployment URLs.

---

## SEO, Google Search Console & Analytics Setup

1. **Canonical Domain**: Update `https://eliasahmad.dev/` in `index.html`, `public/robots.txt`, and `public/sitemap.xml` if you use a different domain.
2. **Google Search Console Verification**:
   - In Google Search Console, choose **HTML tag** verification.
   - Copy the verification token and add it inside `<head>` in `index.html`:
     ```html
     <meta name="google-site-verification" content="YOUR_TOKEN" />
     ```
   - Submit `https://your-domain.com/sitemap.xml` inside Search Console after deployment.
3. **Google Analytics (Optional)**:
   - Set `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in your environment variables. Analytics only loads when configured.

---

## Contact Form & Vercel Deployment

1. Push this repository to GitHub and import it into **Vercel**.
2. Configure environment variables in Vercel (see `.env.example`):
   - `RESEND_API_KEY` (or `FORMSPREE_ENDPOINT`)
   - `CONTACT_RECIPIENT_EMAIL` (defaults to `eliascse19@gmail.com`)
   - Optional: `VITE_SITE_URL`, `VITE_GA_MEASUREMENT_ID`
3. Deploy — `api/contact.ts` runs automatically as a Vercel serverless function.

---

## Local Development

```bash
npm install
npm run dev
```

Production build & typecheck:

```bash
npm run build
npm run lint
```
