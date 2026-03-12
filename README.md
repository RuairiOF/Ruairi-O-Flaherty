# ruairioflaherty.ie

Source code for my personal website and portfolio: [www.ruairioflaherty.ie](https://www.ruairioflaherty.ie)

This repo powers the live site, including:
- landing page and navigation
- projects, experience, skills, and contact pages
- photo gallery
- static assets and SEO files

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- GSAP / Framer Motion (for interactions and animation)

## Run Locally

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## Where Content Lives

Most site content is managed in:
- `src/content/cv.ts`

Useful checks:

```bash
npm run validate-content
```

## Deployment

- Deploys automatically from `main` using GitHub Actions.
- Workflow file: `.github/workflows/deploy.yml`
- Output directory: `dist/`
- Custom domain is configured via `public/CNAME`.

## Project Layout

```text
.
├── public/                 # static files (images, SEO, CNAME, 404 fallback)
├── src/
│   ├── components/         # reusable UI components
│   ├── content/            # CV + page content
│   ├── routes/             # route-level pages
│   ├── styles/             # global styles
│   └── App.tsx             # route wiring
├── scripts/                # utility scripts
└── .github/workflows/      # deployment pipeline
```

## Notes

- This is a personal site, not a starter template.
- If anything is out of date, `src/content/cv.ts` is the first file to check.
