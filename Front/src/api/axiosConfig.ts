import axios from "axios";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: "/api", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키(RefreshToken)를 주고받기 위함
});

// 요청 인터셉터: 모든 요청 헤더에 AccessToken 심어주기
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

// 응답 인터셉터: 401 에러(토큰 만료) 시 재발급 시도
apiClient.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 통과
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 & 아직 재시도하지 않은 요청이라면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지용 플래그

      try {
        // 쿠키에 있는 Refresh Token이 자동으로 같이 전송
        const response = await apiClient.post("/auth/refresh");

        // 백엔드가 새 AccessToken을 body로 줌
        const newAccessToken = response.data.accessToken;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        
        // 실패했던 요청의 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 실패했던 요청 재시도
        return apiClient(originalRequest);

      } catch (refreshError) {
        // 재발급 실패 (Refresh Token도 만료됨 or Redis 삭제됨)
        console.error("토큰 재발급 실패. 로그아웃 처리합니다.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        window.location.href = "/login"; // 강제 로그아웃
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);