# Design System & Motion Specification

## 1. Overview & Aesthetics
The design language of **Whats @CEV / Event Manager** is crafted to provide a futuristic, highly responsive, and premium user experience. Built with a dark-mode first philosophy, glassmorphism, dynamic glowing accents, smooth physics-driven scrolling, and rich interactive WebGL/Three.js visual effects.

---

## 2. Color System & Gradients

### Base Theme Palette
* **Background Primary:** `#05070E` (Deep Midnight Obsidian)
* **Surface Background:** `#0B0F19` / `rgba(15, 23, 42, 0.65)` (Glass Panel Dark)
* **Border Color:** `rgba(255, 255, 255, 0.08)` (Subtle Metallic Rim)
* **Primary Accent:** `#3B82F6` (Electric Blue)
* **Secondary Accent:** `#8B5CF6` (Vibrant Purple)
* **Text Primary:** `#F8FAFC` (Pure Slate 50)
* **Text Muted:** `#94A3B8` (Slate 400)

### Community Color Identities
Each community carries a distinct gradient signature used across cards, badges, and glow effects:
* **IEEE SB CEV:** `from-blue-600 to-cyan-400` (Electric Cyan Glow)
* **IEDC CEV:** `from-green-500 to-emerald-300` (Emerald Innovation Accent)
* **TinkerHub CEV:** `from-yellow-400 to-orange-500` (Solar Amber Accent)
* **FOSS Club CEV:** `from-green-600 to-lime-400` (Open-Source Lime Accent)
* **MuLearn CEV:** `from-purple-600 to-pink-500` (Neon Violet Spectrum)

---

## 3. Typography & Hierarchy

### Font Family
* **Primary Sans:** Inter / System UI Font Stack (`var(--font-sans)`)
* **Display / Accent:** Geometric Sans-Serif with tight tracking (`tracking-tight`)

### Scale & Weight Matrix
| Element | Size | Weight | Tracking | Utility Class |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | 3.5rem - 5rem (56-80px) | 800 (Extrabold) | `-0.03em` | `text-5xl md:text-7xl font-extrabold` |
| **Section Heading**| 2.25rem - 3rem (36-48px) | 700 (Bold) | `-0.02em` | `text-3xl md:text-5xl font-bold` |
| **Card Title** | 1.25rem - 1.5rem (20-24px)| 600 (Semibold) | `-0.01em` | `text-xl md:text-2xl font-semibold` |
| **Body Lead** | 1.125rem (18px) | 400 / 500 | Normal | `text-lg text-slate-300` |
| **Body Regular** | 0.875rem - 1rem (14-16px)| 400 (Regular) | Normal | `text-sm text-slate-400` |
| **Badge / Tag** | 0.75rem (12px) | 600 (Semibold) | `0.05em` | `text-xs uppercase tracking-wider` |

---

## 4. Animation & Motion Architecture

### A. Lenis Smooth Scroll Engine
Scroll inertia is driven by `Lenis` for smooth momentum-based navigation:
* `lerp`: `0.1` (Smooth fluid interpolation)
* `duration`: `1.2s`
* `smoothWheel`: `true`
* `wheelMultiplier`: `1.0`

### B. Three.js & WebGL Visual Effects
* **Interactive Background Canvas:** A GPU-accelerated WebGL particle starfield and organic floating noise sphere rendered behind the hero landing section.
* **Dynamic Card Shader Depth:** Mouse movement computes subtle 3D tilt transformations (`rotateX`, `rotateY`) and glint specular highlights across event cards.

### C. Framer Motion UI Interactions
* **Page Transitions:** Staggered opacity (`0` to `1`) and vertical translate (`y: 20` to `y: 0`).
* **AI Drawer Modal:** Slide-in spring physics (`type: "spring"`, `stiffness: 300`, `damping: 30`).
* **Hover Micro-Interactions:** Scales card element by `1.02` with an expanded box-shadow glow.

### D. GSAP & ScrollTrigger Engine
* **Timeline Animations:** Text reveal triggers synced with vertical scroll depth.
* **Sticky Section Pinning:** Event discovery filter panel pins seamlessly while scrolling through event cards.

---

## 5. UI Layout Components & Patterns

### A. Glassmorphism Card Utility
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### B. Glowing Button Pattern
Interactive call-to-actions feature dual-layer ambient lighting:
* Outer gradient shadow ring (`blur-md opacity-50 group-hover:opacity-100 transition-opacity`)
* Solid inner glass capsule (`bg-slate-900/90 hover:bg-slate-800/90 text-white`)

### C. Event AI Modal Component Layout
* Responsive side drawer on desktop / bottom sheet on mobile devices.
* Conversational message bubbles styled with distinct user slate bubbles vs AI gradient-bordered markdown bubbles.
