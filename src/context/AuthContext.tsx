import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";
import type { User } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  accessToken: null | string;
  setAccessToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        //  refresh token and user stored with new token
        const { accessToken: newToken, user } = await refreshAccessToken();
        setAccessToken(newToken);
        setStoredAccessToken(newToken);
        setUser(user);
      } catch (err) {
        console.log("Failed to refresh accessToken", err);
      }
    };
    loadAuth();
  }, []);

  // sync client and backend when change access token
  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// define custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within provider");
  }
  return context;
};
