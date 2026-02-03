import { apiClient } from "./axiosConfig"; // Axios 인스턴스
import { type User } from "../types/auth"; // User 인터페이스

const BASE_URL = "/api";

// 회원가입 데이터
interface SignupData {
  userId: string;
  password: string;
  name: string;
  email: string;
  verificationCode?: string; // 선택적 속성
  confirmPassword?: string;  // 선택적 속성
}

// 로그인 요청 데이터
interface LoginData {
  loginId: string;
  password: string;
}

// 중복 확인 응답 데이터 타입
interface CheckDuplicateResponse {
  available: boolean;
  message: string;
}

// 중복 확인 (아이디 또는 이메일)
export const checkDuplicate = async (type: "loginId" | "email", value: string): Promise<CheckDuplicateResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/users/check?type=${type}&value=${value}`);
    
    if (!response.ok) {
        throw new Error("중복 확인 요청 실패");
    }

    const data = await response.json();
    console.log("중복 확인 결과:", data); 

    return data;
  } catch (error) {
    console.error("아이디 중복 확인 에러:", error);
    return { available: false, message: "서버 연결 오류" };
  }
};

// 이메일 인증번호 전송(더미)
export const sendVerificationCode = async (email: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[가짜 API] ${email}로 인증번호 전송됨`);
      resolve();
    }, 1000);
  });
};

// 인증번호 검증(더미)
export const verifyCode = async (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === "123456") resolve(true);
      else resolve(false);
    }, 500);
  });
};

// 회원가입 요청
export const registerUser = async (userData: SignupData): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: userData.userId,
        password: userData.password,
        userName: userData.name,
        email: userData.email,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      console.error("회원가입 실패:", errorData);
      alert(`회원가입 실패: ${JSON.stringify(errorData)}`);
      return false;
    }
  } catch (error) {
    console.error("서버 통신 에러:", error);
    return false;
  }
};

// 로그인
export const login = async (loginData: LoginData): Promise<User | null> => {
  try {
    const response = await apiClient.post<User>("/auth/login", {
      loginId: loginData.loginId,
      password: loginData.password,
    });

    const { accessToken, userRole } = response.data ?? {};

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (userRole) localStorage.setItem("userRole", userRole);

    console.log("로그인 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};

// 로그아웃
export const logoutAPI = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");

    // 로그인 시 저장한 정보 정리
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");

    alert("로그아웃 되었습니다");
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  }
};


// 회원 탈퇴
export async function withdrawAccount() {
  try {
    const response = await apiClient.delete("/users/me");
    return response.data;;
  } catch (error: unknown) {
    console.error("회원 탈퇴 실패:", error);
    throw error;
  }
}

// 비밀번호 검증 API (회원 탈퇴 전 확인용)
export const confirmPasswordAPI = async (password: string): Promise<boolean> => {
  try {
    const response = await apiClient.post("/users/me/confirmation", {
      password: password,
    });
    return response.status === 200;
  } catch (error) {
    console.error("비밀번호 검증 실패:", error);
    return false; // 비밀번호 불일치 또는 에러
  }
};