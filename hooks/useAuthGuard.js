import { useEffect, useState } from "react";
import { getRedirectByRole, getSession } from "../lib/authGuard";

export default function useAuthGuard(allowedRoles = []) {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = getSession();

    if (!currentSession?.user?.id || !currentSession?.user?.role) {
      window.location.replace("/login");
      return;
    }

    const role = currentSession.user.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      window.location.replace(getRedirectByRole(role));
      return;
    }

    setSession(currentSession);
    setChecking(false);
  }, []);

  return {
    checking,
    session,
    user: session?.user || null,
    role: session?.user?.role || null,
  };
}