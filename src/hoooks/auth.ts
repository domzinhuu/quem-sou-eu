import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("É preciso envolver o component pai com o AuthProvider");
  }

  return context;
}
