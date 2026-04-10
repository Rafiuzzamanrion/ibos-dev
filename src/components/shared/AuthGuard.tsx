"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types/user.types";
import { PageLoader } from "./PageLoader";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${requiredRole}/login`);
    }
    if (status === "authenticated" && session?.user?.role !== requiredRole) {
      router.push(`/${requiredRole}/login`);
    }
  }, [status, session, requiredRole, router]);

  if (status === "loading") {
    return <PageLoader />;
  }

  if (status === "authenticated" && session?.user?.role === requiredRole) {
    return <>{children}</>;
  }

  return <PageLoader />;
}
