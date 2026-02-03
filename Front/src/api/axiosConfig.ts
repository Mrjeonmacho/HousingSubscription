import axios, { 
  type AxiosError, 
  type InternalAxiosRequestConfig, 
  AxiosHeaders 
} from "axios";

//  Axios Request Config 타입 확장
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 에러 응답 타입
interface ApiErrorResponse {
  code?: string;
  message?: string;
}

// 재발급 응답 타입
interface ReissueResponse {
  accessToken: string;
}

// 토큰 재발급 진행 상태 및 대기열 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// [요청 인터셉터]
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // headers가 없으면 AxiosHeaders 인스턴스로 초기화
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      // headers는 AxiosRequestHeaders 타입이므로 set 메서드 사용 가능
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [응답 인터셉터]
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    const status = error.response?.status;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // [무한 루프 방지] 재발급 요청 자체가 실패한 경우
    const requestUrl = originalRequest.url ?? "";
    if (requestUrl.includes("/auth/refresh")) {
      console.error("리프레시 토큰 만료 또는 유효하지 않음");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // [TOKEN_EXPIRED] 토큰 만료 -> 재발급
    if (status === 401 && errorData?.code === "TOKEN_EXPIRED") {
      if (isRefreshing) {
        // 이미 갱신 중이라면 대기열에 추가하고, 갱신 완료 후 재요청
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (!originalRequest.headers) {
              originalRequest.headers = new AxiosHeaders();
            }
            (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 재발급 요청
        const { data } = await apiClient.post<ReissueResponse>("/auth/refresh");
        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 헤더 갱신
        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders();
        }
        (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${newAccessToken}`);

        // 대기 중이던 요청들 처리
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // 재요청
        return apiClient(originalRequest);

      } catch (refreshError) {
        // 실패 시 대기열도 모두 에러 처리
        processQueue(refreshError, null);
        isRefreshing = false;

        console.error("토큰 재발급 실패", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // [TOKEN_INVALID] 유효하지 않은 토큰
    if (status === 401 && errorData?.code === "TOKEN_INVALID") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
