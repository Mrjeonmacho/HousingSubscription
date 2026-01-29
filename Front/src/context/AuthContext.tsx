import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth";
import { logoutAPI } from "../api/AuthApi";

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
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");

      if (accessToken && userName && userRole) {
        return { accessToken, userName, userRole };
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (userData: User) => {
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("userRole", userData.userRole);
    setUser(userData);
  };

  const logout = async () => {
    await logoutAPI(); // 서버에 로그아웃 요청 (Redis 삭제)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUser(null);

    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};