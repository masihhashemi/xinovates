# Xinovates Marketing Website

A modern, responsive marketing website for Xinovates - AI-Augmented Innovation Lab.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Go to your repository Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` (or `main` with `/docs` folder)
5. Folder: `/root` or `/docs` (if using docs folder)

**Important:** The `base` path in `vite.config.js` is set to `/xinovates/` for GitHub Pages. If you're using a custom domain, change it to `/`.

### Alternative: Vercel/Netlify

For Vercel or Netlify, change the base path in `vite.config.js` to `/`:

```js
base: '/'
```

Then deploy normally - these platforms handle SPA routing automatically.

## Asset Structure

Place your assets in the following locations. **Note:** The site currently uses SVG placeholders. Replace them with your actual assets:

### Images (replace SVG placeholders)
- `/public/assets/images/hero-illustration.png` (or .svg)
- `/public/assets/images/video-poster.jpg` (or .svg)
- `/public/assets/images/Dr-Reza-Kalantarinejad.jpg`
- `/public/assets/images/Prof-Marc-Ventresca.jpg`
- `/public/assets/images/masih-hashemi.jpg`
- `/public/assets/images/Mario-Eguiluz.jpg`
- `/public/assets/images/Samuel-D.-Hayslett.jpg`

### Videos
- `/public/assets/videos/xinovate-videography.mp4` (40-second overview video)

**Important:** Update the image paths in the code if you use different file extensions (e.g., .png instead of .svg).

## Pages

- `/` - Home
- `/product` - Product overview
- `/how-it-works` - Workflow explanation
- `/features` - Feature list
- `/use-cases` - Use cases
- `/roadmap` - Development roadmap
- `/team` - Team page
- `/research` - Research and insights
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of use

## Tech Stack

- React 18
- React Router
- Vite
- React Helmet Async (SEO)

## Design System

- Colors:
  - Navy: #0B1220
  - Blue: #2F6BFF
  - Gray BG: #F5F7FB
  - White: #FFFFFF

- Typography: Inter font family
