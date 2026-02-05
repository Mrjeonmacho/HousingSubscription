import { useState } from "react";

type Props = {
  summary?: string;
};

export default function NoticeAiSummary({ summary }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* 토글 버튼 (헤더 역할) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 transition-colors duration-300
          ${isOpen ? "bg-blue-50/50" : "bg-white hover:bg-gray-50"}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${isOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}
          `}>
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-base ${isOpen ? "text-blue-900" : "text-gray-900"}`}>
              AI 공고 요약
            </h3>
            {!isOpen && (
              <p className="text-xs text-gray-500">클릭하여 요약 내용을 확인하세요</p>
            )}
          </div>
        </div>

        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""}`}>
          keyboard_arrow_down
        </span>
      </button>

      {/* 요약 내용 (펼쳐짐) */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 bg-blue-50/50 animate-fade-in-down">
          <div className="p-5 bg-white rounded-xl border border-blue-100 text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap shadow-sm">
             {summary ? (
               summary
             ) : (
               <span className="text-gray-400 flex items-center gap-2 justify-center py-4">
                 <span className="material-symbols-outlined text-gray-300">error_outline</span>
                 제공된 요약 정보가 없습니다.
               </span>
             )}
          </div>
        </div>
      )}
    </section>
  );
}