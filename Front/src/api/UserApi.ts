import { apiClient } from "./axiosConfig";
import { type UserAddInfo } from "../types/user";

// 기본 정보 조회 (GET)
export const getUserBasicInfo = async (): Promise<{ userName: string; email: string; loginId: string }> => {
  try{
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    console.error("기본 정보 조회 실패:", error);
    throw error;
  }
};

// 기본 정보 수정 (PATCH)
export const updateUserBasicInfo = async (data: { userName: string; email: string }) => {
  try{
    const response = await apiClient.patch("/users/me", data);
    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    console.error("기본 정보 수정 실패:", error);
    throw error;
  }
};

// 추가 정보 조회 (GET)
export const getUserAddInfo = async (): Promise<UserAddInfo> => {
  try{
    const response = await apiClient.get("/users/me/info");
    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    console.error("추가 정보 조회 실패:", error);
    throw error;
  }
};

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

export const updateUserAddInfo = async (data: UserAddInfo) => {
  try{
    const response = await apiClient.put("/users/me/info", data);
    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    console.error("추가 정보 수정 실패:", error);
    throw error;
  }
};



/**
 * 관리자 여부 확인
 * - /users/me 응답의 userRole을 확인해서 boolean 반환
 * - 실패(비로그인/만료 등) 시 false
 */
export const getIsAdmin = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data?.userRole === "ROLE_ADMIN";
  } catch (error: unknown) {
    console.error("관리자 권한 조회 실패:", error);
    return false;
  }
};
