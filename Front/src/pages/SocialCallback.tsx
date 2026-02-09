import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import { getUserBasicInfo } from "../api/UserApi";

export default function SocialCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const processed = useRef(false);

  useEffect(() => {
    // 이미 실행했으면 패스
    if (processed.current) return;
    processed.current = true;

    console.log("소셜 콜백 페이지 진입: 토큰 재발급 시도");

    // API 호출
    apiClient.post("/auth/refresh")
      .then(async (res) => {
        const { accessToken } = res.data;
        if (!accessToken) throw new Error("토큰이 없습니다.");

        localStorage.setItem("accessToken", accessToken);

        const userInfo = await getUserBasicInfo();

        login({
          accessToken: accessToken,
          userName: userInfo.userName,
          userRole: "USER"
        });

        console.log("소셜 로그인 성공!");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("소셜 로그인 실패:", err);
        alert("로그인에 실패했습니다.");
        navigate("/login", { replace: true });
      });

  }, [navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">로그인 중입니다...</p>
    </div>
  );
}