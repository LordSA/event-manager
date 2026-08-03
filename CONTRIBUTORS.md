# Contributors & Community Roll of Honor

Welcome to **Whats @CEV / Event Manager**! We appreciate all contributions to this campus platform.

---

## 👨‍💻 Project Creator & Lead Architect

* **Shibili Aman TK** — Creator, Lead Architect & Maintainer
  * GitHub: [@LordSA](https://github.com/LordSA)
  * Website: [shibili.tech](https://whatsatcev.shibili.tech)

---

## 🌟 Live Community Contributors

All contributors who submit merged pull requests are automatically credited and displayed below via live GitHub API tracking:

[![GitHub Contributors](https://img.shields.io/github/contributors/LordSA/event-manager?style=for-the-badge&color=6366f1)](https://github.com/LordSA/event-manager/graphs/contributors)
[![GitHub All Contributors](https://img.shields.io/github/all-contributors/LordSA/event-manager?style=for-the-badge&color=10b981)](https://github.com/LordSA/event-manager/graphs/contributors)

### Contributor Avatar Wall

<a href="https://github.com/LordSA/event-manager/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LordSA/event-manager" alt="Live GitHub Contributors Avatar Wall" />
</a>

*View the full live commit history on [GitHub Contributors Graph](https://github.com/LordSA/event-manager/graphs/contributors).*

---

## 📜 Contributor Guidelines & Rules to Follow

All contributors working on this repository **MUST** adhere strictly to the following standards:

### 1. Mandatory Single-Line Copyright Header
Every newly created or modified source code file (`.ts`, `.tsx`, `.js`, `.css`) MUST include the creator copyright header at line 1:

```ts
// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
```

### 2. Strict Role-Based Access Control (RBAC) Protection
* **Dev (Superuser) Account Isolation:** `dev` role accounts are strictly isolated. Non-dev accounts CANNOT view, modify, elevate to, or delete `dev` accounts in UI pages (`/admin/users`) or backend API endpoints (`/api/admin/users`).
* **Supabase Service Role Key Safety:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or public variables.

### 3. Production Code Cleanliness
* Keep source code clean and production-ready. Do not push temporary debug notes or commented-out code blocks.

### 4. Branching & Pull Request (PR) Policy
* **Branch Convention:** Use descriptive branch names (e.g. `feature/calendar-export`, `fix/rbac-guard`).
* **PR Requirements:** Include a clear description of changes and confirm that `npm run build` succeeds cleanly before opening a PR.

### 5. Documentation Sync Requirement
Every PR modifying features, tables, or APIs MUST update the corresponding documentation files:
* [project_memory.md](./project_memory.md)
* [changelogs.md](./changelogs.md)
* [README.md](./README.md)
