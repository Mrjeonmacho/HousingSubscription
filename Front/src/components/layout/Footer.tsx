export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/5 px-4 md:px-20 lg:px-40 py-12 bg-white dark:bg-background-dark/50">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">domain</span>
            <h2 className="text-lg font-bold">서울집사 (Seoul Jibsa)</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed font-medium">
            서울의 다음 세대를 위한 최고의 주거 파트너. 내 집 마련의 꿈을 더 쉽고 간편하게 만들어 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#111814] dark:text-white">
              서비스
            </h4>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li><a className="hover:text-primary transition-colors" href="#">AI 채팅</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">SH 공고 찾기</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">오늘의 주거 퀴즈</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#111814] dark:text-white">
              지원
            </h4>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li><a className="hover:text-primary transition-colors" href="#">자주 묻는 질문</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">문의하기</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © 2024 서울집사 (Seoul Jibsa). All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">
            social_leaderboard
          </span>
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">
            language
          </span>
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">
            share
          </span>
        </div>
      </div>
    </footer>
  );
}
