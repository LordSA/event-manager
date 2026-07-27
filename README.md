# 🚀 Whats @CEV (Event Manager)

> **Multi-Community Event Publishing Platform with Dynamic RBAC, Slot Booking Engine & Multi-Provider AI Assistance.**

[![Framework](https://img.shields.io/badge/Framework-Next.js_16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![AI Architecture](https://img.shields.io/badge/AI-Gemini_%E2%86%92_Grok_%E2%86%92_OpenRouter-blueviolet?style=for-the-badge)](https://ai.google.dev/)
[![Scroll Engine](https://img.shields.io/badge/Scroll-Lenis_Smooth-blue?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Graphics](https://img.shields.io/badge/Graphics-Three.js_%7C_WebGL-orange?style=for-the-badge&logo=threedotjs)](https://threejs.org/)

---

## 📖 Overview

In campus environments and multi-organization setups, event information is often scattered across dozens of messaging groups, posters, and scattered sites. **Whats @CEV** is an AI-driven, high-performance event discovery and management platform. It acts as a central hub for multiple campus communities (such as IEEE, IEDC, TinkerHub, FOSS, and MuLearn) to coordinate event dates, publish schedules, prevent date overlaps via slot booking, and answer attendee questions using an interactive **Event AI Assistant**.

---

## ✨ Primary Features

### 🤖 1. Multi-Provider Fallback AI Assistant
Every published event features a contextual AI assistant trained on that specific event's system prompt and rules (venue, schedule, prerequisites, prize pool, food, contact info).
* **Robust Resiliency:** Automated sequential failover flow:

$$\text{User Query} \longrightarrow \text{Google Gemini API} \xrightarrow{\text{If Failed}} \text{Grok API (xAI)} \xrightarrow{\text{If Failed}} \text{OpenRouter API}$$

### 🔐 2. Dynamic Role-Based Access Control (RBAC)
Granular security enforced at both database level (Supabase Row-Level Security) and server/client application levels:
* **Dev / Admin:** Global Super Admin control over users, roles, community CRUD, and all event actions.
* **Manager (Lead):** Full management over their assigned community details, event publishing, slot booking, and deletions.
* **Editor:** Ability to draft and modify events for their community without delete or community profile modification privileges.
* **Public User:** High-performance public event discovery, calendar filtering, search, and AI assistant interaction.

### 📅 3. Slot Booking & Conflict Prevention Engine
* **`closed` State (Draft / Slot Reserved):** Reserves date & time on the master community calendar. Visible to all logged-in community leads to prevent scheduling conflicts and double-booking, but hidden from the public.
* **`live` State (Published):** Instantly surfaces on public search, calendar views, and community pages.

### 🎨 4. Futuristic Motion & WebGL Graphics
* **Three.js & WebGL:** GPU-accelerated interactive particle stars and organic background lighting.
* **Lenis Smooth Scroll:** Butter-smooth physics-based scrolling experience across mobile and desktop.
* **GSAP & Framer Motion:** ScrollTrigger reveals, dynamic card depth effects, and spring-physics modal drawers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/), React 19, TypeScript 5 |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Email OTP) |
| **AI Architecture** | Google Gemini 3 Flash, Grok API (xAI), OpenRouter API |
| **Styling & UI** | Tailwind CSS v4, Glassmorphism design system, Lucide Icons |
| **Animations & Visuals** | Three.js, WebGL, Lenis, Framer Motion, GSAP + ScrollTrigger |
| **Deployment** | Vercel |

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Feature / Action | Dev / Admin | Manager (Lead) | Editor | Public User |
| --- | :---: | :---: | :---: | :---: |
| **View Public Events & Chatbot** | ✅ | ✅ | ✅ | ✅ |
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Provider Keys (Sequential Fallback Pipeline)
GEMINI_API_KEY=your_google_gemini_api_key
GROK_API_KEY=your_xai_grok_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Database Setup
Run the SQL migration script (available in setup documentation) in your Supabase SQL Editor to create tables (`profiles`, `communities`, `events`, `ai_configs`), RLS policies, custom enums, and triggers.

### 5. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 SEO & Performance

* **Dynamic Meta Tags:** Configured using Next.js `generateMetadata` for dynamic OpenGraph, Twitter Cards, and canonical links on event pages.
* **Structured Data:** JSON-LD Event schema automatically rendered for rich Google search indexing.
* **Performance Throttling:** Lenis smooth scroll and WebGL canvas loops optimized for 60fps across mobile and desktop.

---

## 📜 Documentation

* [project_memory.md](./project_memory.md) - Deep architectural breakdown, file map, and state machine workflows.
* [design.md](./design.md) - Design system tokens, color system, typography, and motion rules.
* [changelogs.md](./changelogs.md) - Version history and changes.
* [.agents/AGENTS.md](./.agents/AGENTS.md) - Developer agent workspace rules.

---

## 📄 License & Credits

Built with ❤️ by **Shibili Aman TK** ([@LordSA](https://github.com/LordSA)) & **Saivivek M.V** ([@SaiV-05-18](https://github.com/SaiV-05-18)).
Licensed under the [MIT License](LICENSE).
