import { apiClient } from "./axiosConfig";
import { type UserAddInfo } from "../types/user";

// 추가 정보 입력 (POST)
export const saveUserAddInfo = async (data: UserAddInfo) => {
  try {
    const response = await apiClient.post("/users/me/info", data);
    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    console.error("추가 정보 등록 실패:", error);
    throw error;
  }
};