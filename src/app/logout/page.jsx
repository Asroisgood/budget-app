"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    async function doLogout() {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }

    doLogout();
  }, []);

  return <p>Logging out...</p>;
}
