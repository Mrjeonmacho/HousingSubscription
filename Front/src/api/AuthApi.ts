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

// 이메일 인증코드 발송
export const sendVerificationCode = async (email: string): Promise<string> => {
  const res = await apiClient.post<{ message: string }>("/users/email/code", {
    email,
  });
  return res.data.message; // "EMAIL_CODE_SENT"
};

// 이메일 인증코드 검증
export const verifyCode = async (
  email: string,
  code: string
): Promise<{ verified: boolean; message: string }> => {
  const res = await apiClient.post<{ verified: boolean; message: string }>(
    "/users/email/verification",
    { email, code }
  );
  return res.data; // { verified: true/false, message: "EMAIL_VERIFIED" | "INVALID_CODE" }
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

    window.dispatchEvent(new Event("auth-changed"));

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

    window.dispatchEvent(new Event("auth-changed"));
    
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

// 토큰 재발급 요청 (쿠키에 있는 RefreshToken 사용)
export const refreshTokenAPI = async () => {
  try {
    // 백엔드의 /api/auth/refresh 엔드포인트 호출
    const response = await apiClient.post("/auth/refresh");
    return response.data; 
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    throw error;
  }
};