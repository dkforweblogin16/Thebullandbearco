// FILE PATH: components/AdminGuard.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

// Nothing inside <AdminGuard> ever renders or fetches data unless the
// signed-in user's profile has is_admin = true. Anyone else visiting
// /admin sees a blank page for a split second, then gets sent home.
export default function AdminGuard({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      router.replace("/");
    }
  }, [loading, user, profile, router]);

  if (loading || !user || !profile?.is_admin) {
    return null;
  }

  return children;
}

