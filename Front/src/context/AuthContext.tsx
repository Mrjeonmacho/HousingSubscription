import React, { createContext, useContext, useState } from "react";
import type { User } from "../types/auth"; // 타입 import 확인

// Context 타입
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem("accessToken");
      const userName = localStorage.getItem("userName");
      
      if (token && userName) {
        return { token, userName };
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (userData: User) => {
    localStorage.setItem("accessToken", userData.token);
    localStorage.setItem("userName", userData.userName);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ★ [수정 포인트] 아래 주석을 추가하면 에러가 사라집니다.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};