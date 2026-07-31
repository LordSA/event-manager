# Design System & Motion Specification

## 1. Overview & Aesthetics
The design language of **Whats @CEV / Event Manager** is crafted as a high-contrast dark design system combining **restrained glassmorphism** with **light brutalism** (sharp 2px borders, offset block shadows, clear visual hierarchy). All legacy monochrome slate themes and AI-feeling fonts (Inter) have been completely removed.

---

## 2. Color System & Palette

### Base Dark Palette
* **Background Primary:** `#08090d` (Deep Navy Charcoal)
* **Surface Background:** `#0f121d` (Elevated Panel Dark)
* **Elevated Container:** `#161a29` (Card Surface)
* **Border Colors:** `#1e2436` (Subtle 1px/2px Border) / `#2a334c` (Strong Border)
* **Primary Accent:** `#6366f1` (Electric Indigo) with `#4f46e5` border & `#312e81` shadow
* **Secondary Accent:** `#10b981` (Vibrant Emerald)
* **Text Primary:** `#f8fafc` (High-contrast Slate White)
* **Text Muted:** `#94a3b8` (Slate Neutral Muted)

---

## 3. Typography Hierarchy & Custom Fonts

### Font Optimization (`next/font/local`)
* **Display / Hero Headlines (`font-display`):** `Quera` (`src/fonts/quera.otf`, `--font-quera`)
* **Section Headings & Titles (`font-heading`):** `Gued` (`src/fonts/gued.otf`, `--font-gued`)
* **Body Copy & UI Labels (`font-sans`):** `Rondured` (`src/fonts/roundered.ttf`, `--font-roundered`)
* **System Fallbacks:** `system-ui, -apple-system, sans-serif` (Inter is strictly forbidden).

---

## 4. Light Brutalism & Glassmorphism Tokens

* **Brutalist Cards (`.brutalist-card`):**
  - Background `#0f121d`, 2px `#1e2436` border, offset shadow `shadow-[4px_4px_0px_0px_rgba(30,36,54,0.9)]`. Hover: border `#6366f1` and shadow `#6366f1`.
* **Brutalist Primary Buttons (`.brutalist-btn-primary`):**
  - Background `#6366f1`, border 2px `#4f46e5`, offset shadow `shadow-[3px_3px_0px_0px_#312e81]`.
* **Restrained Glass Panels (`.glass-panel`):**
  - Translucent background `rgba(15, 18, 29, 0.85)` with `backdrop-filter: blur(16px)`.

---

## 5. Header Navigation & Admin Scoping

### Public User POV Header Navigation (`app/components/Navbar.tsx`)
* **Single CTA Button Architecture:** Public navigation links are strictly `Home`, `Events`, `Communities`. `Calendar` is exclusively rendered as the primary right-side CTA pill button (`Calendar ->`).
* **Zero Header Clutter:** Removed top header `Log In` text link completely.
* **Vector Brand Badge:** Replaced broken image icon fallback with a crisp vector shield badge with electric indigo gradient (`#6366f1`).
* **Admin Layout Isolation (`app/components/ConNav.tsx`):** Main public navbar is completely hidden on `/admin` and `/login` routes. On admin pages, only the Admin layout sidebar (`app/admin/layout.tsx`) is rendered.
