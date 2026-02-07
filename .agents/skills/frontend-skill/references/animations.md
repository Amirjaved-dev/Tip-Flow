# Animation Cookbook

Production-ready animation patterns and micro-interactions for minimal, clean interfaces.

## Core Principles

- **Duration:** 150-300ms for most interactions
- **Easing:** `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for transforms
- **Purpose:** Every animation should enhance usability, not just decoration
- **Performance:** Use `transform` and `opacity` for smooth 60fps animations

## Hover Effects

### Lift on Hover

```css
.lift-hover {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.lift-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Scale on Hover

```css
.scale-hover {
  transition: transform 0.2s ease-out;
}

.scale-hover:hover {
  transform: scale(1.05);
}
```

### Border Expand

```css
.border-expand {
  position: relative;
  overflow: hidden;
}

.border-expand::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #000;
  transition: width 0.3s ease-out;
}

.border-expand:hover::after {
  width: 100%;
}
```

### Background Fade

```css
.bg-fade {
  position: relative;
  overflow: hidden;
}

.bg-fade::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #F3F4F6;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bg-fade:hover::before {
  opacity: 1;
}

.bg-fade > * {
  position: relative;
  z-index: 1;
}
```

## Click/Active States

### Button Press

```css
.btn-press {
  transition: transform 0.1s ease;
}

.btn-press:active {
  transform: scale(0.95);
}
```

### Ripple Effect

```css
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}
```

## Page Load Animations

### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

### Slide Up

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}
```

### Stagger Children

```css
.stagger-container > * {
  animation: slideUp 0.4s ease-out;
}

.stagger-container > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-container > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-container > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-container > *:nth-child(4) { animation-delay: 0.4s; }
```

### Scale In

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}
```

## Scroll Animations

### Fade In on Scroll (with Intersection Observer)

```jsx
<div className="fade-in-scroll">Content</div>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-scroll').forEach(el => {
  observer.observe(el);
});
</script>

<style>
.fade-in-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

### Parallax Effect

```jsx
<div className="parallax" data-speed="0.5">
  <img src="background.jpg" alt="Background" />
</div>

<script>
window.addEventListener('scroll', () => {
  const parallax = document.querySelectorAll('.parallax');
  parallax.forEach(el => {
    const speed = el.dataset.speed;
    const yPos = -(window.scrollY * speed);
    el.style.transform = `translateY(${yPos}px)`;
  });
});
</script>
```

## Loading States

### Skeleton Loader

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #F3F4F6 0px,
    #E5E7EB 40px,
    #F3F4F6 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.25rem;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
  margin-bottom: 1rem;
}
```

### Spinner

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E5E7EB;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### Pulse

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### Progress Bar

```css
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.progress-bar {
  height: 4px;
  background: #E5E7EB;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #000;
  border-radius: 9999px;
  animation: progress 2s ease-out;
}
```

## Modal/Overlay Animations

### Modal Fade & Scale

```css
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-overlay {
  animation: modalFadeIn 0.2s ease-out;
}

.modal {
  animation: modalSlideUp 0.3s ease-out;
}
```

### Drawer Slide

```css
@keyframes drawerSlideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer {
  animation: drawerSlideIn 0.3s ease-out;
}
```

## Form Interactions

### Input Focus Glow

```css
.input-glow {
  border: 1px solid #E5E7EB;
  transition: all 0.2s ease;
}

.input-glow:focus {
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  outline: none;
}
```

### Label Float

```css
.input-wrapper {
  position: relative;
}

.floating-label {
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  font-size: 1rem;
  color: #9CA3AF;
  pointer-events: none;
  transition: all 0.2s ease;
}

.input-field:focus ~ .floating-label,
.input-field:not(:placeholder-shown) ~ .floating-label {
  top: -0.5rem;
  left: 0.75rem;
  font-size: 0.75rem;
  color: #000;
  background: white;
  padding: 0 0.25rem;
}
```

### Checkbox Check Animation

```css
.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #E5E7EB;
  border-radius: 0.25rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-checkbox::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.2s ease;
}

input:checked + .custom-checkbox {
  background: #000;
  border-color: #000;
}

input:checked + .custom-checkbox::after {
  transform: rotate(45deg) scale(1);
}
```

## Notification Animations

### Toast Slide In

```css
@keyframes toastSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastSlideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.toast {
  animation: toastSlideIn 0.3s ease-out;
}

.toast.removing {
  animation: toastSlideOut 0.3s ease-in;
}
```

## Advanced Micro-interactions

### Magnetic Button

```jsx
<button className="magnetic-btn" onMouseMove={handleMouseMove}>
  Hover Me
</button>

<script>
function handleMouseMove(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
}

btn.addEventListener('mouseleave', () => {
  btn.style.transform = 'translate(0, 0)';
});
</script>

<style>
.magnetic-btn {
  transition: transform 0.2s ease;
}
</style>
```

### Cursor Follow

```jsx
<div className="cursor-follow"></div>

<script>
const cursor = document.querySelector('.cursor-follow');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
</script>

<style>
.cursor-follow {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
  z-index: 9999;
}
</style>
```

### Counter Animation

```jsx
<span className="counter" data-target="1000">0</span>

<script>
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
  const target = +counter.dataset.target;
  const duration = 2000;
  const step = target / (duration / 16);
  
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      counter.textContent = target;
      clearInterval(timer);
    } else {
      counter.textContent = Math.floor(current);
    }
  }, 16);
});
</script>
```

## Performance Tips

1. **Use `transform` and `opacity`** - Hardware accelerated
2. **Avoid animating** - `width`, `height`, `top`, `left` (use transform instead)
3. **Use `will-change`** - Sparingly, for complex animations
4. **Reduce motion** - Respect user preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```