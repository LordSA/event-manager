# Whats @CEV — Multi-Community Event Management Platform

A modern, high-performance event management, slot booking, and public discovery platform built for **College of Engineering Vadakara (CE Vadakara)** campus communities (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

---

## 🚀 Key Features & Capabilities

- **Centralized Master Event Schedule:** Conflict-free slot booking engine where organizers reserve dates in `closed` draft mode before publishing to `live` state.
- **Role-Based Access Control (RBAC):** Tiered permissions for Developers (`dev`), Super Admins (`admin`), Community Leads (`manager`), and Event Editors (`editor`).
- **Vercel Blob Storage Integration:** Direct client-side WebP image conversion and asset uploading for event posters (`posters/*.webp`), community logos (`logos/*.webp`), and user avatars (`avatars/*.webp`).
- **Fast AI Event Assistant & Response Sanitizer:** Multi-provider fallback AI chat engine (`gemini-1.5-flash` with Grok & OpenRouter fallbacks) with intelligent offline parsing (`generateOfflineResponse`) delivering direct answers for event schedules, venues, rules, and registration guidance without prompt preambles or raw system prompt leaks.
- **Custom Font Optimization (`next/font/local`):** Zero Cumulative Layout Shift (CLS) font engine featuring `Quera` (Display Headlines), `Gued` (Section Headings), and `Rondured` (Body Copy).
- **Public 2-Line & 4-5 Line Summarizer:** Refactored description parser that filters out raw prompt preambles and clamps public card text to prevent layout flickering.
- **Clean Production Codebase:** Zero temporary comments or inline block notes across all `.ts` and `.tsx` source code files.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | Node.js with React 19 & TypeScript 5 |
| **Styling** | Tailwind CSS v4 + Obsidian Dark Design Tokens |
| **Smooth Scroll** | Lenis Smooth Scroll ([app/components/SmoothScroll.tsx](./app/components/SmoothScroll.tsx)) |
| **Database & Auth** | Supabase PostgreSQL + Supabase Auth (OTP & Password) |
| **Storage Engine** | Vercel Blob Storage (`@vercel/blob`) via `./app/api/upload/route.ts` |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) + Grok & OpenRouter |
| **Fonts** | Local font binaries ([fonts/](./fonts/)) |

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Vercel Blob Storage Key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_here

# AI Assistant API Keys
GEMINI_API_KEY=your_gemini_api_key
GROK_API_KEY=your_grok_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## 💻 Developer Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 📁 Repository Structure

```
event-manager/
├── .agents/
│   └── AGENTS.md                  # Developer agent workspace rules & guidelines
├── app/
│   ├── api/
│   │   ├── admin/users/route.ts   # Supabase Auth + Profiles admin management API
│   │   ├── chat/route.ts          # Fast AI assistant endpoint (gemini-1.5-flash)
│   │   └── upload/route.ts        # Vercel Blob storage upload route
│   ├── admin/                     # Protected Admin Console (/admin, /events, /communities, /users)
│   ├── calendar/                  # Google Calendar view route (Month, Week, Day grids)
│   ├── components/                # Reusable UI components (Navbar, EventAiDrawer, MasterCalendar)
│   ├── events/                    # Public event directory & dynamic detail pages
│   └── layout.tsx                 # Root layout with font optimization
├── fonts/                         # Custom font binaries (.otf, .ttf)
├── lib/                           # Core utilities, Supabase client, WebP converter, & summarizers
├── proxy.ts                       # Next.js 16 Proxy middleware for session refresh & route security
├── changelogs.md                  # Detailed versioning history
├── design.md                      # Design system tokens & typography spec
├── project_memory.md              # Technical program memory & database schema
└── README.md                      # Project documentation (this file)
```
