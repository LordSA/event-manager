# Whats @CEV / Multi-Community Event Manager

[![Framework](https://img.shields.io/badge/Framework-Next.js_16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Storage](https://img.shields.io/badge/Storage-Vercel_Blob-black?style=for-the-badge&logo=vercel)](https://vercel.com/docs/storage/vercel-blob)
[![AI Architecture](https://img.shields.io/badge/AI-Gemini_%E2%86%92_Grok_%E2%86%92_OpenRouter-blueviolet?style=for-the-badge)](https://ai.google.dev/)
[![Design System](https://img.shields.io/badge/Design-Clean_Dark_Product-black?style=for-the-badge)](https://tailwindcss.com/)

---

## 📖 Overview

In campus environments and multi-organization setups, event information is often scattered across dozens of messaging groups, posters, and scattered sites. **Whats @CEV** is a high-performance event discovery and management platform designed with a clean, dark product aesthetic (Linear / Vercel / Google Calendar level). It acts as a central hub for campus communities to coordinate event dates, publish schedules, prevent date overlaps via slot booking, upload WebP images via Vercel Blob Storage, explore interactive Google Calendar views, and answer attendee questions using an interactive **Event Assistant**.

- **Framework:** Next.js 16 (App Router) + Next.js 16 Proxy Convention (`proxy.ts`)
- **Styling & Theme:** Tailwind CSS v4 + Obsidian Dark Palette (`#08090d`, `#0f121d`, `#6366f1`)
- **Typography:** Custom Font Engine (`Quera`, `Gued`, `Rondured`) configured via `next/font/local` for zero CLS and preloaded web fonts.
- **Community Management:** Create, edit, slug update, and logo upload for Super Admins and Developers.
- **Database & Auth:** Supabase PostgreSQL & Auth with Dual Login Modes (Password + 6-Digit Email OTP) + One-Click Sign Out.
- **Fast AI Assistant Engine:** `/api/chat/route.ts` using `gemini-1.5-flash` with 250 token caps and 4s timeout abort controllers for sub-500ms response speeds.
- **Z-Index Layered Drawer:** `z-[200]` AI Assistant slide-over drawer with body scroll lock that renders cleanly over floating top navbar.
- **4-5 Line Event Summaries:** Refactored event detail page description (`/events/[id]`) with interactive "Ask Assistant" callout box.
- **Admin Venue & Booking Engine:** Standardized booking form with explicit Venue / Location input, automated AI prompt synthesis, and non-freezing submit handling.

---

## 🔐 Supabase Auth: Configuring 6-Digit OTP Emails (vs Magic Links)

To ensure Supabase sends a **6-Digit Numeric OTP Code** (e.g. `123456`) to the user's inbox instead of a Magic Link URL:

1. Log into your **Supabase Dashboard** -> **Authentication** -> **Email Templates**.
2. Select **Magic Link** (or **Confirm signup**).
3. Replace the link placeholder `{{ .ConfirmationURL }}` with `{{ .Token }}` inside the template body:
   ```html
   <h2>Your CEV Verification Code</h2>
   <p>Enter this 6-digit code to complete your login:</p>
   <h1 style="font-size: 32px; letter-spacing: 4px;">{{ .Token }}</h1>
   ```
4. Save the template.
