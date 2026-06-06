// src/app/auth/login/page.tsx
// Redirects /auth/login → /admin-login for staff,
// or back to home for regular visitors.
import { redirect } from "next/navigation";

export default function AuthLoginPage() {
  redirect("/admin-login");
}
