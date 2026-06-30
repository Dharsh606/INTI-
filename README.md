# INTI — Luxury Interior Design Studio Website

A cinematic, scroll-driven luxury interior design website built with Vite, GSAP, and Lenis smooth scroll.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
inti-website/
├── index.html          ← Single-page layout
├── style.css           ← Full design system
├── main.js             ← GSAP + Lenis animations
├── vite.config.js      ← Vite config
├── package.json
└── public/
    ├── hero-video.mp4          ← Hero background video
    └── assets/
        └── photo/
            ├── bg1.jpg         ← Signature reveal background
            ├── q1.jpg          ← Heritage section background
            ├── watch.jpg       ← Signature project image
            ├── z1.jpg          ← Showcase section image
            ├── ethos-bg.jpg    ← Collection variant 1 (Residential)
            └── ethos-bg-rs.jpg ← Collection variant 2 (Hospitality)
```

## Deploy to Netlify

1. Drag the `dist/` folder into Netlify Drop (https://app.netlify.com/drop)

**Or** connect your Git repo and set:
- Build command: `npm run build`
- Publish directory: `dist`

The contact form uses Netlify Forms (`data-netlify="true"`) — it works automatically on Netlify.

## Sections

1. **Nav** — Fixed, hides on scroll-down, reveals on scroll-up
2. **Hero** — Full-screen video with parallax INTI watermark
3. **Signature Reveal** — Scroll-triggered project showcase
4. **Heritage** — Studio story with animated stats
5. **Collection** — Interactive residential/hospitality switcher
6. **Craftsmanship** — Canvas image-sequence scroll animation
7. **Showcase** — Editorial full-bleed gallery moment
8. **Footer** — Full contact + reservation modal

## Brand Colors

| Role      | Value     |
|-----------|-----------|
| Primary   | `#f7a1c6` |
| Gold      | `#d4af7a` |
| Blue      | `#5bb3e4` |
| Background | `#0b0b0b` |

## Tech Stack

- **Vite** — Build tool
- **GSAP + ScrollTrigger** — Scroll animations & canvas frame scrub
- **Lenis** — Smooth scroll
- **Vanilla JS** — No framework overhead
- **CSS Custom Properties** — Design token system
