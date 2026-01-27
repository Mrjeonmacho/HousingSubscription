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

// 로그인 응답 데이터
interface LoginResponse {
  token: string;
  userName: string;
  message?: string; // 선택적 속성
}

// 아이디 중복 확인
export const checkIdDuplicate = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users/check?type=loginId&value=${userId}`);
    
    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    console.log("중복 확인 결과:", data); 

    return true; 
  } catch (error) {
    console.error("아이디 중복 확인 에러:", error);
    return false;
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

// 로그인 요청
export const login = async (loginData: LoginData): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: loginData.loginId,
        password: loginData.password,
      }),
    });

    if (response.ok) {
      const data: LoginResponse = await response.json();
      console.log("로그인 성공:", data);
      return data;
    } else {
      const errorData = await response.json().catch(() => ({})); 
      console.error("로그인 실패:", errorData);
      return null;
    }
  } catch (error) {
    console.error("서버 통신 에러:", error);
    return null;
  }
};