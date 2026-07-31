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

## 4. Modal Window Sizing, HTML5 Time Parsing & Scroll Rules

### Admin Event Booking Modal Layout (`app/admin/events/page.tsx`)
* **Spacious 2-Column Layout (`max-w-3xl`):** Extended modal container width to `768px` (`max-w-3xl`) with responsive 2-column grid layout for event details, date ranges, venue, and publishing controls.
* **HTML5 Time Parser (`parseTimeTo24Hr`):** Automatically converts 12-hour database strings (e.g. `01:00 PM - 04:00 PM`) into strict 24-hour `HH:mm` format (`13:00` / `16:00`), ensuring HTML `<input type="time" />` elements display start/end times during editing.
* **Lenis Mouse Scroll Interception (`data-lenis-prevent`):** Restores native mouse wheel and trackpad scrolling inside modal overlays without smooth-scroll locks.
