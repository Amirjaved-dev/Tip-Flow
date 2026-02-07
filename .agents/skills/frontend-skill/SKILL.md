---
name: frontend-design-pro
description: Create distinctive, production-grade frontend interfaces with minimal clean design aesthetic. Use when building web components, pages, artifacts, or applications for landing pages, web apps, dashboards, e-commerce sites, React components, or HTML/CSS layouts. Generates creative polished code that avoids generic AI aesthetics. Always asks strategic questions before building to understand brand, audience, and purpose.
---

# Frontend Design Pro

This skill guides creation of premium, minimal-clean frontend interfaces across all project types with production-ready code.

## Core Workflow

**ALWAYS follow this sequence:**

1. **Strategic Discovery** → Ask questions before building (see Discovery Questions below)
2. **Design System Setup** → Establish color palette, typography, spacing
3. **Component Architecture** → Plan component hierarchy and structure  
4. **Implementation** → Write clean, production-ready code
5. **Polish & Animation** → Add micro-interactions and refinements

## Discovery Questions

**CRITICAL: Before writing any code, ask these questions to understand context:**

**Brand & Purpose:**
- What's the primary goal of this interface? (convert, inform, engage, transact)
- Who is the target audience? (age, tech-savviness, industry)
- What feeling should the design evoke? (trust, excitement, sophistication, playfulness)
- Any existing brand colors, fonts, or style references?

**Scope & Constraints:**
- Is this a single component, full page, or multi-page app?
- Any specific features or interactions required?
- Any technical constraints? (framework preference, browser support, performance)
- Mobile-first or desktop-first priority?

**Content:**
- What's the key message or content hierarchy?
- Any specific content to include, or should placeholder content be created?

Tailor questions to the project type—landing pages need brand focus, dashboards need data structure, e-commerce needs conversion optimization.

## Design System Foundations

### Color Palette Generation

Use strategic, minimal palettes (3-5 colors maximum):

**Primary color** → Brand identity, CTAs, key elements
**Neutral scale** → Gray palette (50, 100, 200...900) for text, backgrounds, borders  
**Accent color** → Optional, for highlights and secondary actions
**Semantic colors** → Success (green), error (red), warning (amber), info (blue)

**Apple-style minimal approach:**
- Favor neutrals (whites, grays, blacks) as primary surface colors
- Use color sparingly for emphasis and hierarchy
- Ensure 4.5:1 contrast ratio for accessibility (WCAG AA)

```css
/* Example minimal palette */
--primary: #000000;        /* Pure black for text */
--surface: #FFFFFF;        /* Pure white backgrounds */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #4B5563;
--gray-900: #111827;
--accent: #2563EB;         /* Minimal blue accent */
```

### Typography System

**Apple-inspired typography hierarchy:**

```css
/* System font stack */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Scale (1.25 ratio) */
--text-xs: 0.75rem;    /* 12px - labels, captions */
--text-sm: 0.875rem;   /* 14px - secondary text */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - large body */
--text-xl: 1.25rem;    /* 20px - small headings */
--text-2xl: 1.5rem;    /* 24px - headings */
--text-3xl: 1.875rem;  /* 30px - large headings */
--text-4xl: 2.25rem;   /* 36px - hero text */

/* Weight */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
```

**Hierarchy principles:**
- Use size AND weight for hierarchy (not just size)
- Generous line-height (1.5-1.7 for body, 1.1-1.3 for headings)
- Limited font weights (regular, medium, semibold max)
- Never use more than 3 font sizes on a single view

### Spacing System

**8px base unit for consistency:**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

**Usage:**
- Intra-component spacing: 4px, 8px, 12px, 16px
- Inter-component spacing: 24px, 32px, 48px
- Section spacing: 64px, 96px, 128px
- Generous whitespace is essential for minimal aesthetic

## Component Library Patterns

### Button Component

```jsx
// Minimal button with variants
<button className="btn-primary">
  Primary Action
</button>

/* Styles */
.btn-primary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: black;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

**Variants:** Primary (filled), secondary (outline), ghost (text only)

### Card Component

```jsx
<div className="card">
  <div className="card-content">
    {/* Content */}
  </div>
</div>

/* Minimal card */
.card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 1.5rem;
}
```

### Input Component

```jsx
<div className="input-wrapper">
  <label className="input-label">Email</label>
  <input 
    type="email" 
    className="input-field"
    placeholder="you@example.com"
  />
</div>

/* Clean input styling */
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: black;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}
```

## Animation & Interaction Guidelines

### Micro-interactions (Apple-style subtle animations)

**Principles:**
- Fast (150-300ms duration)
- Subtle (small transforms, gentle fades)
- Purposeful (enhance usability, not decoration)
- Use easing functions: `ease-out` for entrances, `ease-in` for exits

```css
/* Hover lift */
.interactive-element {
  transition: transform 0.2s ease-out;
}
.interactive-element:hover {
  transform: translateY(-2px);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Button press */
.btn:active {
  transform: scale(0.98);
}
```

### Loading States

```jsx
// Skeleton loader for content
<div className="skeleton">
  <div className="skeleton-line"></div>
  <div className="skeleton-line short"></div>
</div>

/* Minimal skeleton */
.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Responsive Design Patterns

**Mobile-first approach** (default for all projects unless specified):

```css
/* Mobile base styles */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1024px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

**Breakpoint system:**
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

**Mobile optimizations:**
- Touch targets minimum 44x44px
- Readable font sizes (16px+ body text)
- Simplified navigation (hamburger menus)
- Optimized images (responsive srcset)

## Code Quality Standards

### File Structure

**For single-file artifacts (HTML/React):**
- All CSS inline using `<style>` tag or Tailwind classes
- All JS inline or imported from CDN
- Self-contained, no external dependencies

**For multi-file projects:**
```
project/
├── index.html
├── styles/
│   ├── reset.css
│   ├── variables.css
│   └── main.css
├── scripts/
│   └── main.js
└── assets/
    └── images/
```

### CSS Best Practices

**Use modern CSS:**
```css
/* CSS Grid for layouts */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Flexbox for components */
.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* CSS Variables for theming */
:root {
  --primary-color: #000;
  --bg-color: #fff;
}
```

**Avoid:**
- !important (except rare edge cases)
- Inline styles (use classes)
- Overly specific selectors (.a .b .c .d)
- Magic numbers (use variables)

### Accessibility (WCAG AA Minimum)

**Always include:**
```html
<!-- Semantic HTML -->
<header>
<main>
<nav>
<article>
<section>

<!-- ARIA labels where needed -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- Alt text for images -->
<img src="hero.jpg" alt="Product dashboard showing analytics">

<!-- Form labels -->
<label for="email">Email Address</label>
<input id="email" type="email">

<!-- Keyboard navigation -->
<a href="#" tabindex="0">Link</a>
```

**Check:**
- Color contrast ratios (4.5:1 for text, 3:1 for UI)
- Keyboard navigation works for all interactive elements
- Screen reader compatibility (test with semantic HTML)
- Focus indicators visible on all focusable elements

## Project Type Specific Guidance

### Landing Pages

**Structure:**
1. Hero section (value proposition + CTA)
2. Benefits/Features (3-4 max)
3. Social proof (testimonials, logos, stats)
4. Secondary CTA
5. Footer

**Design focus:**
- Large, impactful hero with minimal text
- Clear visual hierarchy guiding to CTA
- Generous whitespace between sections
- Subtle animations on scroll

### Web Apps & Dashboards

**Structure:**
1. Top navigation or sidebar
2. Main content area with cards/tables
3. Action panels/modals for interactions

**Design focus:**
- Information density balanced with whitespace
- Consistent spacing and alignment
- Clear data visualization (charts, graphs)
- Loading states for async data

### E-commerce

**Structure:**
1. Product grid/list
2. Filtering & sorting
3. Product detail page
4. Shopping cart
5. Checkout flow

**Design focus:**
- High-quality product images
- Clear pricing and CTAs
- Trust signals (reviews, security badges)
- Streamlined checkout (minimal steps)

## Advanced Techniques

### Glassmorphism (when appropriate)

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}
```

Use sparingly—only when it enhances hierarchy or creates depth.

### CSS Grid Advanced Layouts

```css
/* Asymmetric grid */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
}

/* Named grid areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### Dark Mode Support

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --text-primary: #ffffff;
  }
}

/* Or toggle class */
.dark {
  --bg-primary: #000000;
  --text-primary: #ffffff;
}
```

## Performance Optimization

**Critical techniques:**

1. **Optimize images:**
   - Use WebP format with fallbacks
   - Lazy load below-the-fold images
   - Responsive images with srcset

2. **Minimize CSS:**
   - Remove unused styles
   - Combine media queries
   - Use CSS containment

3. **Efficient JS:**
   - Defer non-critical scripts
   - Use event delegation
   - Debounce scroll/resize handlers

4. **Loading strategy:**
   - Inline critical CSS
   - Async load fonts
   - Preload key resources

## Avoiding AI Design Clichés

**DO NOT use these overused patterns:**
- Gradient backgrounds with purple/pink/blue (unless brand-specific)
- Excessive blur effects everywhere
- Generic stock photos
- Cookie-cutter hero sections with centered text
- Rainbow gradients on text
- Neumorphism (raised/pressed effects)

**INSTEAD:**
- Use solid colors, real brand colors, or subtle gradients
- Prioritize whitespace and typography
- Use illustrations or authentic photography
- Create unique layouts based on content
- Let content and hierarchy drive design
- Focus on clarity and usability

## Quality Checklist

Before delivering, verify:

- [ ] All interactive elements have hover states
- [ ] Focus states visible for keyboard navigation  
- [ ] Responsive across mobile, tablet, desktop
- [ ] Color contrast meets WCAG AA standards
- [ ] Loading states for async operations
- [ ] Semantic HTML structure
- [ ] No console errors or warnings
- [ ] Clean, commented code where needed
- [ ] Consistent spacing using design system
- [ ] Typography hierarchy clear and effective

## Additional Resources

For deep dives into specific patterns, reference these files:

- **Layout patterns:** See `references/layouts.md` for advanced grid/flexbox patterns
- **Component library:** See `references/components.md` for full component specifications
- **Animation cookbook:** See `references/animations.md` for animation patterns and examples