"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getTokenPayload, logout } from "@/lib/auth/token";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const payload = getTokenPayload();
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    const publicRoutes = ["/login", "/users"];
    const isPublic = publicRoutes.includes(pathname);

    const isTokenExpired = payload?.exp && payload.exp < now;

    if ((!token || isTokenExpired) && !isPublic) {
      logout(); // Clean up expired token
      router.replace("/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
