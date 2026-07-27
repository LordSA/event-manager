# Project Rules for Developer Agents

These rules are specific to the **Event Manager / Whats @CEV** workspace. All automated developer agents or human coders working in this repository MUST follow these rules strictly.

## 1. Keep Documentation Synced
Every time a change or edit is made to the codebase, you **must** update:
- [project_memory.md](./project_memory.md): Add or revise descriptions of modified files, functions, or schemas.
- [design.md](./design.md): Update theme properties, layout structures, or animation tokens if design variables change.
- [changelogs.md](./changelogs.md): Log all changes with dates, version tags, and detailed descriptions.
- [README.md](./README.md): Update setup instructions, environmental keys, or command references if dependencies change.

## 2. Clean Up Agent Comments
- **CRITICAL**: Before finishing work or committing files, you **MUST** remove all temporary notes, comment indicators, block explanations, or explanatory comments added inside source code files (`.ts`, `.tsx`, `.js`, `.css`). Clean, production-ready code is mandatory.

## 3. Check Documentation First
- Before attempting any repository modification or code execution, you **must** read [project_memory.md](./project_memory.md) and [design.md](./design.md) to understand current schemas, configurations, RBAC matrices, and component behaviors.

## 4. Architectural & Code Quality Standards
- Preserve the Next.js App Router structure and strict TypeScript types.
- Ensure Supabase RLS policies are strictly respected in database operations.
- Ensure Lenis smooth scrolling, Three.js/WebGL render loops, and GSAP/Framer Motion animations are properly cleaned up on component unmount to prevent memory leaks.
- Ensure SEO meta tags and structured data (JSON-LD) are maintained across dynamic event pages.
