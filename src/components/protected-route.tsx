import { getSession } from "@/data/services";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router";

type ProtectRouteProps = PropsWithChildren;

export function ProtectedRoute({ children }: ProtectRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const logged = getSession();
    if (logged === null) navigate("/", { replace: true });
  }, [navigate]);

  return <>{children}</>;
}
