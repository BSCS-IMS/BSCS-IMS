"use client"
import { auth } from "@/app/lib/firebase";
import { useEffect } from "react";

export default function TokenRefresher() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Force refresh the ID token
          const token = await user.getIdToken(true);

          // Send new token to backend to update cookie
          await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, email: user.email, password: null }),
          });
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }
    }, 40 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
