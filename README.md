# Personal Portfolio Website

A modern, fast, and accessible personal portfolio built with Vite, React, TypeScript, and Tailwind CSS. Designed for easy deployment to GitHub Pages.

## ✅ Content Populated

**Content Status:** This website has been populated with CV content for **Ruairi O'Flaherty**.

The content in `src/content/cv.ts` includes:
- ✅ Personal information and contact details
- ✅ Education (UCD Mechanical Engineering)
- ✅ Work experience (Patch, Walls Construction, CareChoice, etc.)
- ✅ Projects (EirPost, ROF's 3D, Cashew)
- ✅ Skills organized by categories
- ✅ Awards (UCD Entrance Scholar)

The website is ready for immediate deployment to GitHub Pages.

## ✨ Features

- **Modern Design**: Clean, professional layout with dark/light mode support
- **Fully Responsive**: Optimized for all device sizes
- **Fast Performance**: Built with Vite for optimal loading speeds
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter Card support
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **GitHub Pages Ready**: Automated deployment with GitHub Actions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM (static routes)
- **Icons**: Lucide React
- **Animations**: Framer Motion (optional micro-interactions)
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier
- **Deployment**: GitHub Actions → GitHub Pages

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Content Management

### Updating Your Information

All content is managed in `src/content/cv.ts`. This file contains:

- **Personal Information**: Name, headline, location, contact details
- **Work Experience**: Companies, roles, dates, achievements
- **Education**: Institutions, degrees, dates, details
- **Projects**: Portfolio pieces with descriptions, technologies, and links
- **Skills**: Organized by categories
- **Awards & Certificates**: Recognition and certifications

### Content Validation

Run the content validation script to check for missing information and TODOs:

```bash
npm run validate-content
```

This will:
- ✅ Verify required fields are present
- ⚠️ Warn about empty sections
- 📝 List all TODO items that need attention

## 🚀 Deployment to GitHub Pages

This project supports two GitHub Pages deployment modes:

### Option 1: User/Organization Site (`username.github.io`)

1. **Repository name must be**: `username.github.io` (replace `username` with your GitHub username)

2. **Set environment variable** (optional, as this is the default):
   ```bash
   # In your repository settings or locally
   VITE_BASE_PATH="/"
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

4. **Deploy**:
   ```bash
   git push origin main
   ```

### Option 2: Project Site (`username.github.io/repository-name`)

1. **Any repository name** is fine

2. **Set environment variable**:
   ```bash
   # In your repository settings → Secrets and variables → Actions
   # Add repository variable:
   VITE_BASE_PATH="/repository-name/"
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

4. **Deploy**:
   ```bash
   git push origin main
   ```

### Manual Build

To build locally and preview:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/
│   ├── images/                 # Project images and assets
│   ├── favicon.svg             # Site favicon
│   ├── manifest.webmanifest    # PWA manifest
│   ├── robots.txt              # Search engine rules
│   └── sitemap.xml             # Site structure for SEO
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Navigation with mobile support
│   │   ├── Footer.tsx          # Footer with social links
│   │   ├── SEO.tsx             # SEO meta tag management
│   │   ├── ProjectCard.tsx     # Project display component
│   │   ├── Section.tsx         # Page section wrapper
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   │   └── SkipToContent.tsx   # Accessibility navigation
│   ├── content/
│   │   └── cv.ts               # ⭐ All your personal content
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── routes/                 # Page components
│   │   ├── Home.tsx            # Landing page
│   │   ├── Projects.tsx        # Portfolio showcase
│   │   ├── About.tsx           # Detailed bio and timeline
│   │   ├── Contact.tsx         # Contact form and information
│   │   └── NotFound.tsx        # 404 error page
│   ├── styles/
│   │   └── index.css           # Tailwind CSS and custom styles
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── scripts/
│   └── validate-content.ts     # Content validation script
└── Configuration files...
```

## 🎨 Customization

### Styling

The design system is built with Tailwind CSS and includes:
- **Color Scheme**: Customizable in `tailwind.config.js`
- **Typography**: System font stack with Inter as fallback
- **Components**: Pre-built button, card, and layout styles
- **Dark Mode**: Automatic system preference detection

### Adding Custom Domain

1. **Create CNAME file**:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Update site configuration** in `src/content/cv.ts`:
   ```typescript
   export const siteConfig = {
     url: 'https://yourdomain.com',
     // ... other config
   }
   ```

3. **Configure DNS** with your domain provider:
   - Add CNAME record pointing to `username.github.io`

### Environment Variables

- `VITE_BASE_PATH`: Base URL path for routing (set automatically by GitHub Actions)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run validate-content` - Check for missing content and TODOs

## 🐛 Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build`
- Verify all required fields in `src/content/cv.ts`
- Run content validation: `npm run validate-content`

### GitHub Pages Not Updating
- Check Actions tab for deployment status
- Verify `VITE_BASE_PATH` is set correctly for project sites
- Ensure repository has Pages enabled with "GitHub Actions" source

### Contact Form Not Working
- The form uses `mailto:` by default (no server required)
- Users need a configured email client
- Email will be pre-populated with form data

### Dark Mode Issues
- Theme preference is saved to localStorage
- Falls back to system preference
- Clear localStorage if theme appears stuck

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use!

---

**Built with ❤️ using modern web technologies**
