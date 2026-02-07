# Component Library Reference

Complete specifications for common UI components with Apple-style minimal aesthetic.

## Navigation Components

### Top Navigation Bar

```jsx
<nav className="navbar">
  <div className="navbar-brand">
    <img src="logo.svg" alt="Logo" />
  </div>
  <ul className="navbar-menu">
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#about">About</a></li>
  </ul>
  <button className="btn-primary">Get Started</button>
</nav>

<style>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
}

.navbar-menu a {
  color: #4B5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar-menu a:hover {
  color: #000;
}
</style>
```

### Sidebar Navigation

```jsx
<aside className="sidebar">
  <div className="sidebar-header">
    <h2>Dashboard</h2>
  </div>
  <nav className="sidebar-nav">
    <a href="#" className="nav-item active">
      <svg>...</svg>
      <span>Overview</span>
    </a>
    <a href="#" className="nav-item">
      <svg>...</svg>
      <span>Analytics</span>
    </a>
    <a href="#" className="nav-item">
      <svg>...</svg>
      <span>Settings</span>
    </a>
  </nav>
</aside>

<style>
.sidebar {
  width: 250px;
  height: 100vh;
  background: white;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #4B5563;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #F3F4F6;
}

.nav-item.active {
  background: #000;
  color: white;
}
</style>
```

## Form Components

### Input Field

```jsx
<div className="form-group">
  <label htmlFor="email" className="form-label">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    className="form-input"
    placeholder="you@example.com"
  />
  <span className="form-hint">We'll never share your email.</span>
</div>

<style>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.form-input::placeholder {
  color: #9CA3AF;
}

.form-hint {
  font-size: 0.75rem;
  color: #6B7280;
}
</style>
```

### Select Dropdown

```jsx
<div className="form-group">
  <label htmlFor="country" className="form-label">
    Country
  </label>
  <select id="country" className="form-select">
    <option>United States</option>
    <option>Canada</option>
    <option>United Kingdom</option>
  </select>
</div>

<style>
.form-select {
  padding: 0.75rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}
</style>
```

### Checkbox & Radio

```jsx
<label className="checkbox-label">
  <input type="checkbox" className="checkbox-input" />
  <span className="checkbox-text">I agree to the terms</span>
</label>

<style>
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #000;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #4B5563;
}
</style>
```

## Button Variants

### Primary Button

```jsx
<button className="btn btn-primary">
  Get Started
</button>

<style>
.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
```

### Secondary Button

```jsx
<button className="btn btn-secondary">
  Learn More
</button>

<style>
.btn-secondary {
  background: white;
  color: #000;
  border: 1px solid #E5E7EB;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}
</style>
```

### Ghost Button

```jsx
<button className="btn btn-ghost">
  Cancel
</button>

<style>
.btn-ghost {
  background: transparent;
  color: #4B5563;
  padding: 0.75rem 1rem;
}

.btn-ghost:hover {
  background: #F3F4F6;
  color: #000;
}
</style>
```

## Card Components

### Basic Card

```jsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content goes here.</p>
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Action</button>
  </div>
</div>

<style>
.card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
}
</style>
```

### Product Card

```jsx
<div className="product-card">
  <div className="product-image">
    <img src="product.jpg" alt="Product" />
  </div>
  <div className="product-info">
    <h4 className="product-title">Product Name</h4>
    <p className="product-description">Brief description</p>
    <div className="product-footer">
      <span className="product-price">$99</span>
      <button className="btn btn-primary">Add to Cart</button>
    </div>
  </div>
</div>

<style>
.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
```

## Modal/Dialog

```jsx
<div className="modal-overlay">
  <div className="modal">
    <div className="modal-header">
      <h3>Modal Title</h3>
      <button className="modal-close">&times;</button>
    </div>
    <div className="modal-body">
      <p>Modal content here.</p>
    </div>
    <div className="modal-footer">
      <button className="btn btn-ghost">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>

<style>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #9CA3AF;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E7EB;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

## Alert/Notification

```jsx
<div className="alert alert-success">
  <svg className="alert-icon">...</svg>
  <div className="alert-content">
    <h4 className="alert-title">Success!</h4>
    <p className="alert-message">Your changes have been saved.</p>
  </div>
  <button className="alert-close">&times;</button>
</div>

<style>
.alert {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
}

.alert-success {
  background: #F0FDF4;
  border-left-color: #22C55E;
  color: #15803D;
}

.alert-error {
  background: #FEF2F2;
  border-left-color: #EF4444;
  color: #991B1B;
}

.alert-warning {
  background: #FFFBEB;
  border-left-color: #F59E0B;
  color: #92400E;
}

.alert-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
}

.alert-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}
</style>
```

## Badge/Tag

```jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-gray">Archived</span>

<style>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-primary {
  background: #000;
  color: white;
}

.badge-success {
  background: #DCFCE7;
  color: #15803D;
}

.badge-gray {
  background: #F3F4F6;
  color: #4B5563;
}
</style>
```

## Tabs

```jsx
<div className="tabs">
  <div className="tab-list">
    <button className="tab active">Overview</button>
    <button className="tab">Details</button>
    <button className="tab">Settings</button>
  </div>
  <div className="tab-content">
    {/* Tab content */}
  </div>
</div>

<style>
.tabs {
  width: 100%;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  gap: 2rem;
}

.tab {
  background: none;
  border: none;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab:hover {
  color: #000;
}

.tab.active {
  color: #000;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #000;
}

.tab-content {
  padding: 2rem 0;
}
</style>
```