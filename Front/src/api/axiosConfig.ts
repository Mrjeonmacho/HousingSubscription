import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

// Axios Request Config 타입 확장
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 에러 응답 타입
interface ApiErrorResponse {
  code?: string;
  message?: string;
}

// 재발급 응답 타입
// interface ReissueResponse {
//   accessToken: string;
// }

// 토큰 재발급 진행 상태 및 대기열 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// 헤더에 Authorization 안전하게 세팅 (AxiosHeaders 캐스팅 문제 방지)
function setAuthHeader(
  headers: InternalAxiosRequestConfig["headers"],
  token: string
) {
  const h = AxiosHeaders.from(headers);
  h.set("Authorization", `Bearer ${token}`);
  return h;
}

// refresh 응답에서 accessToken 추출 (백엔드 필드명 차이 대응)
type UnknownObject = Record<string, unknown>;

function isObject(value: unknown): value is UnknownObject {
  return typeof value === "object" && value !== null;
}

function extractAccessToken(data: unknown): string | null {
  if (!isObject(data)) return null;

  if (typeof data.accessToken === "string") {
    return data.accessToken;
  }

  if (typeof data.access_token === "string") {
    return data.access_token;
  }

  if (typeof data.token === "string") {
    return data.token;
  }

  if (isObject(data.data) && typeof data.data.accessToken === "string") {
    return data.data.accessToken;
  }

  return null;
}

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
    const url = config.url ?? "";

    // refresh 요청에는 accessToken을 붙이지 않기
    if (url.includes("/auth/refresh")) return config;

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = setAuthHeader(config.headers, token);
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
    const status = error.response?.status;
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    if (!originalRequest) return Promise.reject(error);

    const requestUrl = originalRequest.url ?? "";

    // [무한 루프 방지] refresh 요청 자체가 실패한 경우
    if (requestUrl.includes("/auth/refresh")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // [유효하지 않은 토큰] refresh 시도해도 의미 없으면 바로 로그아웃
    if (status === 401 && errorData?.code === "TOKEN_INVALID") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이면 그대로 종료
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 401이면 refresh 시도 (code 의존 제거)
    if (status === 401) {
      if (isRefreshing) {
        // 이미 갱신 중이면 대기열에 추가 후 완료되면 재요청
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = setAuthHeader(originalRequest.headers, token);
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 재발급 요청
        const { data } = await apiClient.post<unknown>("/auth/refresh");

        const newAccessToken = extractAccessToken(data);
        if (!newAccessToken) {
          throw new Error("refresh 응답에 accessToken이 없습니다.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        // 대기 중이던 요청들 처리
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // 원 요청 재시도
        originalRequest.headers = setAuthHeader(
          originalRequest.headers,
          newAccessToken
        );
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
