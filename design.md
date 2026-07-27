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
* **Secondary Accent:** `#06B6D4` (Electric Cyan)
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

## 3. Navigation & Mobile App UI Architecture

### A. Desktop Header Navigation
* Sticky top header (`sticky top-0 z-40`) with translucent backdrop blur (`backdrop-blur-xl bg-[#05070E]/90`).
* Clean brand logo, direct links (`Home`, `Discover Events`, `Communities`), and conditional manager badge + logout controls when authenticated.

### B. Mobile App Bottom Navigation Bar
* On mobile viewports (`< 768px`), the navigation transfers to a native mobile app-style bottom bar (`fixed bottom-0 left-0 right-0 z-50 md:hidden`).
* **Surface:** Translucent glassmorphism panel (`bg-[#05070E]/95 backdrop-blur-2xl border-t border-slate-800/80`).
* **Active Indicator:** Gradient accent bar (`w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400`) positioned above the active tab icon.
* **Layout Spacing:** Main page containers incorporate safe bottom padding (`pb-20 md:pb-0`) to prevent bottom navigation overlap.

---

## 4. Typography & Hierarchy

### Font Family
* **Primary Sans:** Inter / System UI Font Stack (`var(--font-sans)`)
* **Display / Accent:** Geometric Sans-Serif with tight tracking (`tracking-tight`)

### Scale & Weight Matrix
| Element | Size | Weight | Tracking | Utility Class |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | 3.5rem - 5rem (56-80px) | 800 (Extrabold) | `-0.03em` | `text-4xl sm:text-6xl lg:text-7xl font-extrabold` |
| **Section Heading**| 2.25rem - 3rem (36-48px) | 700 (Bold) | `-0.02em` | `text-3xl md:text-5xl font-bold` |
| **Card Title** | 1.25rem - 1.5rem (20-24px)| 600 (Semibold) | `-0.01em` | `text-xl font-bold` |
| **Body Lead** | 1.125rem (18px) | 400 / 500 | Normal | `text-lg text-slate-300` |
| **Body Regular** | 0.875rem - 1rem (14-16px)| 400 (Regular) | Normal | `text-sm text-slate-400` |
| **Badge / Tag** | 0.75rem (12px) | 600 (Semibold) | `0.05em` | `text-xs uppercase tracking-wider` |

---

## 5. Animation & Visual Shader Architecture

### A. Three.js & WebGL Visual Effects
* **GPU Particle Starfield (`HeroCanvas.tsx`):** Renders 200 animated particles with color interpolation between electric blue, vibrant purple, and cyan. Smooth camera drift reacts to mouse movement.

### B. Framer Motion UI Interactions
* **Event Assistant Slide-Over Drawer (`EventAiDrawer.tsx`):** Physics spring transition (`type: "spring"`, `damping: 25`, `stiffness: 250`). Slide-in from right (`x: '100%'` to `x: 0`).

### C. Lenis Smooth Scroll Engine
* Momentum-based fluid scroll (`lerp: 0.1`) integrated globally across Next.js root layout.
