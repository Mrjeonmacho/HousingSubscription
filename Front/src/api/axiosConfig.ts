import axios from "axios";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: "/api", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키(RefreshToken) 전송 필수
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // 로그인 요청 자체가 실패한 경우(비밀번호 틀림 등)는 재발급 시도 X
    // URL에 '/login'이 포함되어 있으면 그냥 에러를 반환해서 LoginPage가 처리하게 함
    if (originalRequest.url && originalRequest.url.includes("/login")) {
      return Promise.reject(error);
    }

    // 401 에러이고, 아직 재시도하지 않은 요청이라면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        // 재발급 요청
        const response = await apiClient.post("/auth/refresh");
        const newAccessToken = response.data.accessToken;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        
        // 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 재시도
        return apiClient(originalRequest);

      } catch (refreshError) {
        // 재발급도 실패하면 로그아웃
        console.error("토큰 재발급 실패. 로그아웃 처리합니다.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("loginId");
        localStorage.removeItem("email");
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);