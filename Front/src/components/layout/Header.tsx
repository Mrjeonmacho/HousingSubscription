// seoul-jibsa\src\components\layout\Header.tsx
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUIStore } from "../../store/uiStore";

export default function Header() {
  const openAlert = useUIStore((s) => s.openAlert);

  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상태 선언 (함수 내부로 이동)
  const [showKorean, setShowKorean] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. useEffect 배치 (함수 내부로 이동)
  useEffect(() => {
    const timer = setInterval(() => {
      setShowKorean((prev) => !prev);
    }, 3000); // 3초마다 변경

    return () => clearInterval(timer);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault(); 
      window.location.href = "/";
    }
  };

  const handleLogout = () => {
    openAlert({
      title: "알림",
      message: "로그아웃 되었습니다.",
      onConfirm: () => {
        logout();
        navigate("/");
      },
    });
  };

  const navBase = "text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap";
  const navActive = "text-sm font-semibold text-primary whitespace-nowrap";

  const navClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? navActive : navBase;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 px-4 ${isActive ? "text-primary font-semibold bg-primary/5" : "text-gray-700 font-medium hover:bg-gray-50"}`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3">
          <img
            src="/seouljibsa.png"
            alt="서울집사 로고"
            className="h-9 w-9 object-contain"
          />
          
          {/* 텍스트 전환 영역: overflow-hidden이 있어야 나가는 글자가 안 보입니다 */}
          <span className="text-[15px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden relative w-[110px] h-[22px]">
            
            {/* 한글: showKorean이 true일 때 중앙, false일 때 아래(full)로 이동 */}
            <span 
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                showKorean 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}
            >
              서울집사
            </span>

            {/* 영어: showKorean이 true일 때 위(-full)에서 대기, false일 때 중앙으로 이동 */}
            <span 
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                showKorean 
                  ? '-translate-y-full opacity-0' 
                  : 'translate-y-0 opacity-100'
              }`}
            >
              Seoul Jibsa
            </span>

          </span>
        </Link>

        {/* Center: Nav (생략 - 기존과 동일) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <NavLink to="/" onClick={handleHomeClick} className={navClass}>홈</NavLink>
          <NavLink to="/notices" className={navClass}>SH 공고 찾기</NavLink>
          <NavLink to="/chatbot" className={navClass}>AI 채팅</NavLink>
          <NavLink to="/playground" className={navClass}>청약 놀이터</NavLink>
          <NavLink to="/mypage" className={navClass}>마이페이지</NavLink>
        </nav>

        {/* Right: Actions (생략 - 기존과 동일) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/mypage" className="font-bold text-gray-700 hover:text-primary transition-colors cursor-pointer text-sm sm:text-base">
                {user.userName}님
              </Link>
              <button onClick={handleLogout} className="text-xs sm:text-sm text-gray-500 hover:text-black whitespace-nowrap">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors whitespace-nowrap">
                로그인
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-5 sm:py-2 shadow-md shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap">
                시작하기
              </Link>
            </div>
          )}
          <button className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors ml-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined text-2xl">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
      {/* 모바일 메뉴 드롭다운 (생략 - 기존과 동일) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-fade-in-down">
          <nav className="flex flex-col py-2">
            <NavLink to="/" className={mobileNavClass} onClick={closeMenu}>홈</NavLink>
            <NavLink to="/notices" className={mobileNavClass} onClick={closeMenu}>SH 공고 찾기</NavLink>
            <NavLink to="/chatbot" className={mobileNavClass} onClick={closeMenu}>AI 채팅</NavLink>
            <NavLink to="/playground" className={mobileNavClass} onClick={closeMenu}>청약 놀이터</NavLink>
            <NavLink to="/mypage" className={mobileNavClass} onClick={closeMenu}>마이페이지</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}