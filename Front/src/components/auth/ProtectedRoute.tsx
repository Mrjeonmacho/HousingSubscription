import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  // 로그인이 안 되어 있으면 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
    return <Navigate to="/login" replace />;
  }

  // 로그인이 되어 있으면 자식 컴포넌트(Outlet) 보여줌
  return <Outlet />;
}