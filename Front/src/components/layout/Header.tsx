// seoul-jibsa\src\components\layout\Header.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("Header - isLoggedIn:", isLoggedIn, "user:", user);

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  // 모바일 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navBase =
    "text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap";
  const navActive = "text-sm font-semibold text-primary whitespace-nowrap";

  const navClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? navActive : navBase;

  // 모바일 메뉴 아이템용 스타일
  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 px-4 ${isActive ? "text-primary font-semibold bg-primary/5" : "text-gray-700 font-medium hover:bg-gray-50"}`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px]">domain</span>
          </div>
          <span className="text-[15px] font-semibold text-gray-900 whitespace-nowrap">
            서울집사 (Seoul Jibsa)
          </span>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <NavLink to="/" className={navClass}>홈</NavLink>
          <NavLink to="/notices" className={navClass}>SH 공고 찾기</NavLink>
          <NavLink to="/chatbot" className={navClass}>AI 채팅</NavLink>
          <NavLink to="/playground" className={navClass}>청약 놀이터</NavLink>
          <NavLink to="/mypage" className={navClass}>마이페이지</NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Auth Actions */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/mypage"
                className="font-bold text-gray-700 hover:text-primary transition-colors cursor-pointer text-sm sm:text-base"
              >
                {user.userName}님
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm text-gray-500 hover:text-black whitespace-nowrap"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors whitespace-nowrap"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-5 sm:py-2 shadow-md shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                시작하기
              </Link>
            </div>
          )}

          {/* Hamburger Button (Mobile) */}
          <button
            className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors ml-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>
      {/* 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-fade-in-down">
          <nav className="flex flex-col py-2">
            <NavLink to="/" className={mobileNavClass} onClick={closeMenu}>
              홈
            </NavLink>
            <NavLink to="/notices" className={mobileNavClass} onClick={closeMenu}>
              SH 공고 찾기
            </NavLink>
            <NavLink to="/chatbot" className={mobileNavClass} onClick={closeMenu}>
              AI 채팅
            </NavLink>
            <NavLink to="/playground" className={mobileNavClass} onClick={closeMenu}>
              청약 놀이터
            </NavLink>
            <NavLink to="/mypage" className={mobileNavClass} onClick={closeMenu}>
              마이페이지
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
