# Security Policy

## Supported Versions

Security updates and patches are actively applied to the following project versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.61.x  | :white_check_mark: |
| < 0.60  | :x:                |

---

## 🔒 Security Principles & RBAC Matrix Guarantees

1. **Dev (Superuser) Account Isolation:** `dev` accounts are protected against unauthorized modification or deletion by non-dev accounts in both client UI views and server-side API endpoints (`/api/admin/users`).
2. **Service Role Key Safety:** The `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side API routes (`/api/admin/*`, `/api/profile`) and never exposed to the client bundle.
3. **Storage Security:** Asset WebP uploads via `/api/upload` validate file sizes (< 5MB) and mime types.

---

## 🐛 Reporting a Vulnerability

If you discover a security vulnerability or RBAC bypass within **Whats @CEV / Event Manager**, please report it privately:

* **Author & Lead Maintainer:** Shibili Aman TK
* **GitHub Profile:** [@LordSA](https://github.com/LordSA)
* **Direct Contact:** [shibili.tech](https://whatsatcev.shibili.tech)

Please **do not** open public GitHub issues for security vulnerabilities.
