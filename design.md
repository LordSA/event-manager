# Design System & Motion Specification

## 1. Overview & Aesthetics
The design language of **Whats @CEV / Event Manager** is crafted as a high-contrast dark design system combining **restrained glassmorphism** with **light brutalism** (sharp borders, offset block shadows, clear visual hierarchy). All generic monochrome slate themes and AI-feeling fonts (Inter) have been completely removed.

---

## 2. Color System & Palette

### Base Dark Palette
* **Background Primary:** `#08090d` (Deep Navy Charcoal)
* **Surface Background:** `#0f121d` (Elevated Panel Dark)
* **Elevated Container:** `#161a29` (Card Surface)
* **Border Colors:** `#1e2436` (Subtle 1px/2px Border) / `#2a334c` (Strong Border)
* **Primary Accent:** `#6366f1` (Electric Indigo) with `#4f46e5` border
* **Secondary Accent:** `#10b981` (Vibrant Emerald)
* **Text Primary:** `#f8fafc` (High-contrast Slate White)
* **Text Muted:** `#94a3b8` (Slate Neutral Muted)

---

## 3. Typography Hierarchy & Custom Fonts

### Font Families
* **Display / Hero Headlines:** `Quera` (Custom Display Sans)
* **Section Headings & Titles:** `Gued` (Custom Geometric Display)
* **Body Copy & UI Labels:** `Rondured` (Clean Custom UI Sans)
* **System Fallbacks:** `system-ui, -apple-system, sans-serif` (Inter is strictly forbidden).

### Scale & Weight Matrix
| Element | Font Family | Size | Weight | Utility Class / Variable |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `Quera` | 3rem - 4.5rem | 700 | `font-display font-bold text-white` |
| **Section Heading** | `Gued` | 1.875rem - 2.25rem | 600 | `font-heading font-bold text-white` |
| **Card Title** | `Gued` | 1.125rem - 1.25rem | 600 | `font-heading font-bold text-white` |
| **Body Regular** | `Rondured` | 0.875rem - 1rem | 400 | `font-sans text-[#94a3b8]` |

---

## 4. Light Brutalism & Glassmorphism Tokens

* **Brutalist Cards (`.brutalist-card`):**
  - Background `#0f121d`, 2px `#1e2436` border, offset shadow `shadow-[4px_4px_0px_0px_rgba(30,36,54,0.9)]`. Hover: border `#6366f1` and shadow `#6366f1`.
* **Brutalist Primary Buttons (`.brutalist-btn-primary`):**
  - Background `#6366f1`, border 2px `#4f46e5`, offset shadow `shadow-[3px_3px_0px_0px_#312e81]`.
* **Restrained Glass Panels (`.glass-panel`):**
  - Translucent background `rgba(15, 18, 29, 0.85)` with `backdrop-filter: blur(16px)` for floating sticky header navbar.

---

## 5. Navigation & Brand Identity Architecture

### Header Navigation (`app/components/Navbar.tsx`)
* **Floating Glass Pill Design:** Dynamic scroll detection (`window.scrollY > 20`) transitioning from `py-6 px-4` to `py-3 px-10` with a floating rounded pill backdrop (`rounded-[2rem] bg-[#0f121d]/85 backdrop-blur-xl border border-[#1e2436]`).
* **GSAP Entrance Animations:** GSAP context animations for `.nav-logo` and `.nav-item` stagger entrance on component mount.
* **Active Indicator:** Glowing Indigo dot (`bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.8)]`) below active page links.
* **Glossy CTA Pill:** Gradient action button (`from-[#6366f1] to-[#4f46e5]`) with top light reflection for Log In / Dashboard navigation.
* **Full-Screen Mobile Overlay Menu:** Interactive fullscreen drawer (`bg-[#08090d] z-[110]`) with animated hamburger icon, numbered list items (`01`, `02`, `03`...), and social connectivity links.
