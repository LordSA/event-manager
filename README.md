# 🚀 Whats @CEV (Event Manager)

> **Multi-Community Event Publishing Platform with Dynamic RBAC, Slot Booking Engine & Real-Time Event Assistance.**

[![Framework](https://img.shields.io/badge/Framework-Next.js_16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![AI Architecture](https://img.shields.io/badge/AI-Gemini_%E2%86%92_Grok_%E2%86%92_OpenRouter-blueviolet?style=for-the-badge)](https://ai.google.dev/)
[![Scroll Engine](https://img.shields.io/badge/Scroll-Lenis_Smooth-blue?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Graphics](https://img.shields.io/badge/Graphics-Three.js_%7C_WebGL-orange?style=for-the-badge&logo=threedotjs)](https://threejs.org/)

---

## 📖 Overview

In campus environments and multi-organization setups, event information is often scattered across dozens of messaging groups, posters, and scattered sites. **Whats @CEV** is an AI-driven, high-performance event discovery and management platform. It acts as a central hub for multiple campus communities (such as IEEE, IEDC, TinkerHub, FOSS, and MuLearn) to coordinate event dates, publish schedules, prevent date overlaps via slot booking, and answer attendee questions using an interactive **Event Assistant**.

---

## 🔐 Supabase Auth: Configuring 6-Digit OTP Emails (vs Magic Links)

To ensure Supabase sends a **6-Digit Numeric OTP Code** (e.g. `123456`) to the user's inbox instead of a Magic Link URL:

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)** $\rightarrow$ Select your project.
2. Navigate to **Authentication** $\rightarrow$ **Email Templates**.
3. Under **Magic Link** (or **Confirm Signup**):
   * Replace `{{ .ConfirmationURL }}` with `{{ .Token }}` in the email body template.
   * Example Email Body:
     ```html
     <h2>Your Login Verification Code</h2>
     <p>Your 6-digit OTP login code for Whats @CEV is:</p>
     <h1 style="font-size: 32px; font-family: monospace; letter-spacing: 4px;">{{ .Token }}</h1>
     <p>Enter this code in your login screen to sign in.</p>
     ```
4. Save changes. The system will now email 6-digit OTP codes for all manager login requests!

---

## ✨ Primary Features

### 🤝 1. Friendly Event Assistant & Multi-Provider Fallback AI
Every published event features a contextual Event Assistant trained on that specific event's details (venue, schedule, prerequisites, prize pool, food, contact info).
* **Warm Peer Tone:** Speaks in a natural, casual, super-friendly tone like a knowledgeable campus buddy.
* **Robust Failover Routing:** Automated sequential failover flow:

$$\text{User Query} \longrightarrow \text{Google Gemini API} \xrightarrow{\text{If Failed}} \text{Grok API (xAI)} \xrightarrow{\text{If Failed}} \text{OpenRouter API}$$

### 🔐 2. Dynamic Role-Based Access Control (RBAC) & Edge Proxy
Granular security enforced at database level (Supabase Row-Level Security) and Next.js 16 Edge Proxy (`proxy.ts`):
* **Dev / Admin:** Global Super Admin control over users, roles, community CRUD, and all event actions.
* **Manager (Lead):** Full management over assigned community details, event publishing, slot booking, and deletions.
* **Editor:** Ability to draft and modify events for their community without delete or community profile modification privileges.
* **Public User:** Clean public event discovery, calendar filtering, search, and Event Assistant interaction.

### 📅 3. Slot Booking & Conflict Prevention Engine
* **`closed` State (Draft / Slot Reserved):** Reserves date & time on the master community calendar. Visible to all logged-in community leads to prevent scheduling conflicts and double-booking, but hidden from the public.
* **`live` State (Published):** Instantly surfaces on public search, calendar views, and community pages.

### 📱 4. Mobile App UI & Bottom Navigation Bar
* **Native App Feel:** Fixed bottom navigation bar (`fixed bottom-0 left-0 right-0 z-50 md:hidden`) featuring active tab indicators, glassmorphic backdrop, and touch feedback.
* **Three.js & WebGL:** GPU-accelerated interactive particle starfield background.
* **Lenis Smooth Scroll:** Butter-smooth physics-based scrolling experience across mobile and desktop.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Feature / Action | Dev / Admin | Manager (Lead) | Editor | Public User |
| --- | :---: | :---: | :---: | :---: |
| **View Public Events & Assistant** | ✅ | ✅ | ✅ | ✅ |
| **Manage User Accounts & Roles** | ✅ | ❌ | ❌ | ❌ |
| **Create / Delete Communities** | ✅ | ❌ | ❌ | ❌ |
| **Edit Community Details (Logo/Bio)** | ✅ | ✅ (Own Community) | ❌ | ❌ |
| **Create & Edit Events** | ✅ (All) | ✅ (Own Community) | ✅ (Own Community) | ❌ |
| **Delete Events** | ✅ (All) | ✅ (Own Community) | ❌ | ❌ |
| **Set Event Status (`closed`/`live`)** | ✅ (All) | ✅ (Own Community) | ✅ (Own Community) | ❌ |

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js:** v18.17.0 or higher
* **npm:** v9.0.0 or higher
* **Supabase Project:** Created on [supabase.com](https://supabase.com)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/LordSA/event-manager.git
cd event-manager
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# AI Provider Keys (Sequential Fallback Pipeline)
GEMINI_API_KEY=your_google_gemini_api_key_here
GROK_API_KEY=your_xai_grok_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Base Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Migration
Run the SQL migration script provided in setup documentation inside your Supabase SQL Editor.

### 5. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Documentation

* [project_memory.md](./project_memory.md) - Deep technical program memory, DB schemas, and state machine workflows.
* [design.md](./design.md) - Design system tokens, color system, typography, motion rules, and mobile app UI specs.
* [changelogs.md](./changelogs.md) - Version history and release notes.
* [.agents/AGENTS.md](./.agents/AGENTS.md) - Developer agent workspace rules.

---

## 📄 License & Credits

Built with ❤️ by **Shibili Aman TK** ([@LordSA](https://github.com/LordSA)) & **Saivivek M.V** ([@SaiV-05-18](https://github.com/SaiV-05-18)).
Licensed under the [MIT License](LICENSE).
