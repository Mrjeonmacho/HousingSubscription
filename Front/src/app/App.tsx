import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

import Layout from "../components/layout/Layout";
import ChatbotLayout from "../components/chatbot/ChatbotLayout";

import HomePage from "../pages/HomePage";
import NoticesPage from "../pages/NoticesPage";
import Playground from "../pages/Playground/Playground";
import Quiz from "../pages/Playground/Quiz";
import Preference from "../pages/Playground/Preference";
import Chatbot from "../pages/Chatbot";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 일반 페이지: 기존 Layout 적용 */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/notices" element={<NoticesPage />} />

            <Route path="/playground">
              <Route index element={<Playground />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="preference" element={<Preference />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* 챗봇 페이지: ChatbotLayout(기존 헤더만) 적용 */}
          <Route element={<ChatbotLayout />}>
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
