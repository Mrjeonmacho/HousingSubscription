// Front/src/components/auth/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUIStore } from "../../store/uiStore";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const openAlert = useUIStore((s) => s.openAlert);

  useEffect(() => {
    if (isLoggedIn) return;

    openAlert({
      title: "로그인 안내", 
      icon: "lock",
      message: "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.",
      onConfirm: () => {
        navigate("/login", { replace: true });
      },
    });
  }, [isLoggedIn, openAlert, navigate]);

  if (!isLoggedIn) return null;

  return <Outlet />;
}