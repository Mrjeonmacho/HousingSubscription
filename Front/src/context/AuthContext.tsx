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
  updateUserState: (newInfo: { userName: string }) => void;
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

  const updateUserState = (newInfo: { userName: string }) => {
    setUser((prevUser) => {
      if (!prevUser) return null; // 로그인 안 된 상태면 무시

      // 기존 유저 정보에 새 이름만 덮어쓰기
      const updatedUser = { 
        ...prevUser, 
        userName: newInfo.userName, 
      };

      // 새로고침해도 유지되도록 localStorage도 업데이트
      localStorage.setItem("userName", newInfo.userName);
      
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, updateUserState }}>
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