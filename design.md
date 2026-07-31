# Design System & Motion Specification

## 1. Overview & Aesthetics
The design language of **Whats @CEV / Event Manager** is crafted as a clean, highly readable, standard dark-mode product design (Linear / Vercel / Notion / Google Calendar level). Excessive glassmorphism, Three.js starfields/particles, neon glowing borders, tight font tracking, and futuristic AI fluff have been completely removed in favor of clarity, structured grid layouts, precise whitespace, soft borders, and reliable UI components.

---

## 2. Color System & Palette

### Base Theme Palette
* **Background Primary:** `#0a0a0a` (Deep Dark Neutral)
* **Surface Background:** `#121212` / `#171717` (Neutral Dark Panels)
* **Border Color:** `#262626` / `border-neutral-800` (Crisp 1px Neutral Border)
* **Primary Accent:** Pure White (`#ffffff`) & Soft Slate Neutral
* **Text Primary:** `#ffffff` (High-contrast White)
* **Text Muted:** `#a1a1aa` / `text-neutral-400` (Slate Neutral)

---

## 3. Navigation & Calendar UI Architecture

### A. Desktop & Mobile Header Navigation
* Sticky top header (`sticky top-0 z-40`) with crisp `#0a0a0a` background and `#262626` bottom border.
* **Exact Navigation Links:** `Logo | Home | Calendar | Events | Communities` (+ `Dashboard` link when authenticated as manager/admin).
* Clean active link state highlighting with neutral pill backgrounds.

### B. Google Calendar Page & Component (`/calendar`)
* Google Calendar style view switcher supporting **Month**, **Week**, and **Day** views.
* **Month View:** 7-column calendar grid showing days of the month, events listed on their dates with time slot details.
* **Week & Day Views:** 12-hour vertical time slot grid (8 AM to 8 PM) positioning events as duration-spanning time-block cards based on actual start and end times.
* Filter by community and interactive click-to-open event details modal.

---

## 4. Typography & Hierarchy

### Font Family
* **Primary Sans:** Geist Sans / Inter / System UI Font Stack with normal tracking (`tracking-tight` removed).

---

## 5. Animation & Motion Rules
* Standard clean CSS transitions (`transition-colors`, `transition-all 150ms`).
* Physics-driven drawer transitions remain functional for the Event Assistant.
* Three.js particle starfields and neon glowing overlays are permanently disabled.
