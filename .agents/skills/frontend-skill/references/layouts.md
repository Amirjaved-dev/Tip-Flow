# Advanced Layout Patterns

This reference provides detailed grid and flexbox patterns for complex layouts.

## CSS Grid Patterns

### Holy Grail Layout

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.content { grid-area: content; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

@media (max-width: 768px) {
  .holy-grail {
    grid-template-areas:
      "header"
      "nav"
      "content"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### Masonry Layout

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span);
}

/* Calculate row span with JS */
/* item.style.setProperty('--row-span', Math.ceil(height / 10)); */
```

### Magazine Layout

```css
.magazine {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 2rem;
}

.feature {
  grid-column: span 8;
  grid-row: span 4;
}

.sidebar-1 {
  grid-column: span 4;
  grid-row: span 2;
}

.sidebar-2 {
  grid-column: span 4;
  grid-row: span 2;
}

.article {
  grid-column: span 4;
  grid-row: span 3;
}
```

### Dashboard Grid

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 200px;
  gap: 1.5rem;
}

.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}

.widget-wide {
  grid-column: span 2;
}

.widget-tall {
  grid-row: span 2;
}
```

## Flexbox Patterns

### Navbar with Logo and Menu

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
}
```

### Card Grid with Flexbox

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  flex: 1 1 calc(33.333% - 2rem);
  min-width: 280px;
}

@media (max-width: 768px) {
  .card {
    flex: 1 1 100%;
  }
}
```

### Sticky Footer

```css
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

.footer {
  /* Will stick to bottom */
}
```

### Split Screen

```css
.split-screen {
  display: flex;
  min-height: 100vh;
}

.left-pane {
  flex: 1;
  background: #f5f5f5;
}

.right-pane {
  flex: 1;
  background: white;
}

@media (max-width: 768px) {
  .split-screen {
    flex-direction: column;
  }
}
```

## Hybrid Grid + Flexbox

### Product Gallery

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  padding: 1rem;
}
```

### Article with Sidebar

```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
}
```

## Responsive Patterns

### Container Query Pattern

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: 150px 1fr;
  }
}
```

### Fluid Typography with clamp()

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

p {
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```

### Responsive Spacing

```css
.section {
  padding: clamp(2rem, 5vw, 6rem) clamp(1rem, 3vw, 3rem);
}

.grid {
  gap: clamp(1rem, 2vw, 2rem);
}
```