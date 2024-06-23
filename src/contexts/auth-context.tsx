import {
  clearSession,
  doLogin,
  getSession,
  updateSession,
} from "@/data/services";
import { User } from "@/models/user";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  login: (username: string) => void;
  updateInfo: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(getSession());

  const updateLoggedUserInfo = (user: User) => {
    setUser(user);
    updateSession(user);
  };

  const login = (username: string) => {
    const user = doLogin(username);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  useEffect(() => {
    const logged = getSession();
    if (logged) {
      setUser(logged);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, updateInfo: updateLoggedUserInfo, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}
