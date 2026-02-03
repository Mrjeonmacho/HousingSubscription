import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// 레이아웃 및 인증 관련
import Layout from "../components/layout/Layout";
import ChatbotLayout from "../components/chatbot/ChatbotLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ScrollToTop from "../components/common/ScrollToTop";

// 일반 페이지
import HomePage from "../pages/HomePage";
import NoticesPage from "../pages/NoticesPage";
import NoticeDetailPage from "../pages/NoticeDetailPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MyPage from "../pages/MyPage";

// 놀이터 페이지
import Playground from "../pages/Playground/Playground";
import Quiz from "../pages/Playground/Quiz";
import Preference from "../pages/Playground/Preference";

// 404 Not Found 페이지
import NotFoundPage from "../pages/NotFoundPage";

// 챗봇 페이지
import Chatbot from "../pages/Chatbot";

// 관리자(admin) 페이지
import NoticeCreatePage from "../pages/Admin/NoticeCreatePage";
import NoticeUpdatePage from "../pages/Admin/NoticeUpdatePage";

export default function App() {
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
              <Route path=":noticeId(\\d+)" element={<NoticeDetailPage />} />
            </Route>

            {/* 놀이터 관련 */}
            <Route path="/playground">
              <Route index element={<Playground />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="preference" element={<Preference />} />
            </Route>

            {/* 인증이 필요한 페이지 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 관리자 페이지 */}
            <Route path="/admin/notices/create" element={<NoticeCreatePage />} />
            <Route path="/admin/notices/:noticeId(\\d+)/update" element={<NoticeUpdatePage />} />

            {/* 404 Not Found 페이지 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* 챗봇 페이지: ChatbotLayout 적용 */}
          <Route element={<ChatbotLayout />}>
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/chatbot/*" element={<NotFoundPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}