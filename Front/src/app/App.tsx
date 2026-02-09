import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { useUIStore } from "../store/uiStore";

// 레이아웃 및 인증 관련
import Layout from "../components/layout/Layout";
import FullLayout from "../components/layout/FullLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ScrollToTop from "../components/common/ScrollToTop";
import AlertModal from "../components/modals/AlertModal";

// 일반 페이지
import HomePage from "../pages/HomePage";
import NoticesPage from "../pages/NoticesPage";
import NoticeDetailPage from "../pages/NoticeDetailPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MyPage from "../pages/MyPage";
import SocialCallback from "../pages/SocialCallback";

// 놀이터 페이지
import Checkin from "../pages/Checkin/Checkin";
import Quiz from "../pages/Checkin/Quiz";
import Preference from "../pages/Checkin/Preference";

// 404 Not Found 페이지
import NotFoundPage from "../pages/NotFoundPage";

// 챗봇 페이지
import Chatbot from "../pages/Chatbot";

// 관리자(admin) 페이지
import NoticeCreatePage from "../pages/Admin/NoticeCreatePage";
import NoticeUpdatePage from "../pages/Admin/NoticeUpdatePage";


export default function App() {
  const { alertOpen, alert, closeAlert } = useUIStore();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* 일반 페이지: 기존 Layout 적용 */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            
            {/* 공고 관련 */}
            <Route path="/notices">
              <Route index element={<NoticesPage />} />
              <Route path=":noticeId" element={<NoticeDetailPage />} />
            </Route>

            {/* 인증이 필요한 페이지 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth/callback" element={<SocialCallback />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 관리자 페이지 */}
            <Route path="/admin/notices/create" element={<NoticeCreatePage />} />
            <Route path="/admin/notices/:noticeId/update" element={<NoticeUpdatePage />} />

            {/* 404 Not Found 페이지 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* FullLayout */}
          <Route element={<FullLayout />}>
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/chatbot/*" element={<NotFoundPage />} />

            {/* 놀이터 관련 */}
            <Route path="/checkin">
              <Route index element={<Checkin />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="preference" element={<Preference />} />
            </Route>
          </Route>

        </Routes>

        {/* 전역 AlertModal 배치 (Routes 밖, AuthProvider 안) */}
        <AlertModal
          isOpen={alertOpen}
          title={alert?.title}
          message={alert?.message ?? ""}
          icon={alert?.icon}
          variant={alert?.variant}
          confirmText={alert?.confirmText}
          onConfirm={() => {
            alert?.onConfirm?.();
            closeAlert();
          }}
          onClose={() => {
            alert?.onClose?.();
            closeAlert();
          }}
          cancelText={alert?.cancelText}
        />

      </AuthProvider>
    </BrowserRouter>
  );
}
