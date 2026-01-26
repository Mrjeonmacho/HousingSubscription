// seoul-jibsa\src\components\layout\Header.tsx
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const navBase =
    "text-sm font-medium text-gray-700 hover:text-primary transition-colors";
  const navActive = "text-sm font-semibold text-primary";

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? navActive : navBase;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px]">domain</span>
          </div>
          <span className="text-[15px] font-semibold text-gray-900">
            서울집사 (Seoul Jibsa)
          </span>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navClass}>
            <span className="inline-flex items-center gap-1.5">
              홈
            </span>
          </NavLink>

          <NavLink to="/notices" className={navClass}>
            SH 공고 찾기
          </NavLink>

          <NavLink to="/chatbot" className={navClass}>
            AI 채팅
          </NavLink>

          <NavLink to="/playground" className={navClass}>
            청약 놀이터
          </NavLink>

          <NavLink to="/mypage" className={navClass}>
            마이페이지
          </NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
          >
            로그인
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold px-5 py-2 shadow-md shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
