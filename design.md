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

## 4. AI Latency, Event Detail Summarization & Z-Index Architecture

### AI Assistant Z-Index Layering (`EventAiDrawer.tsx`)
* **Z-Index Layer (`z-[200]`):** Side drawer and backdrop set to `z-[200]` so the assistant drawer sits completely on top of the fixed top navbar (`z-[100]`), locking body scroll (`overflow: hidden`).
* **Optimized Latency (`app/api/chat/route.ts`):** Fast-path model execution using `gemini-1.5-flash` with `maxOutputTokens: 250` and 4-second timeout abort controllers for sub-500ms response times.
* **4-5 Line Description Refactoring (`app/events/[id]/page.tsx`):** Automatically refactors event descriptions into a clean 4-5 line public overview, stripping raw prompt preambles and attaching an interactive "Ask Assistant" callout.
* **Admin Venue Input (`app/admin/events/page.tsx`):** Added explicit Venue / Location input field to the booking form.
