/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type ComponentPropsWithoutRef } from "react";

type Props = {
  summary?: string;
};

// HTML 속성 + node 속성 정의
type MarkdownComponentProps<T extends React.ElementType> = ComponentPropsWithoutRef<T> & {
  node?: object;
};

export default function NoticeAiSummary({ summary }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // 모달이 열려있을 때 뒷배경 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          w-full rounded-2xl
          border border-primary/20
          bg-white
          p-5
          shadow-sm
          text-left
          cursor-pointer
          transition-all duration-300
          hover:border-primary/50
          hover:bg-primary/5
          hover:shadow-md
          group
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-full
                bg-primary/10
                flex items-center justify-center
                text-primary
                transition-all duration-300
                group-hover:bg-primary
                group-hover:text-white
                group-hover:scale-110
              "
            >
              <span className="material-symbols-outlined text-[20px]">
                auto_awesome
              </span>
            </div>

            <div>
              <h3
                className="
                  font-bold text-base text-gray-900
                  transition-colors
                  group-hover:text-primary
                "
              >
                AI 공고 요약 보기
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                복잡한 공고 내용을 AI가 핵심만 요약해 드려요
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* 모달 오버레이 (화면 덮기) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setIsOpen(false)} // 배경 클릭 시 닫기
        >
          {/* 모달 컨텐츠 박스 */}
          <div 
            className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h3 className="font-bold text-lg text-gray-900">AI 공고 요약</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 모달 본문 (스크롤 가능) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="text-gray-700 leading-relaxed text-[15px]">
                {summary ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 링크
                      a: ({ node, ...props }: MarkdownComponentProps<"a">) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500"
                        />
                      ),
                      // 리스트 (ul)
                      ul: ({ node, ...props }: MarkdownComponentProps<"ul">) => (
                        <ul {...props} className="list-disc pl-4 my-3 space-y-1.5" />
                      ),
                      // 리스트 (ol)
                      ol: ({ node, ...props }: MarkdownComponentProps<"ol">) => (
                        <ol {...props} className="list-decimal pl-4 my-3 space-y-1.5" />
                      ),
                      // 리스트 아이템
                      li: ({ node, ...props }: MarkdownComponentProps<"li">) => (
                        <li {...props} className="pl-1" />
                      ),
                      // 볼드체
                      strong: ({ node, ...props }: MarkdownComponentProps<"strong">) => (
                        <strong {...props} className="font-bold text-gray-900 bg-yellow-100/50 px-0.5 rounded" />
                      ),
                      // 인용문
                      blockquote: ({ node, ...props }: MarkdownComponentProps<"blockquote">) => (
                        <blockquote
                          {...props}
                          className="border-l-4 border-blue-200 bg-blue-50/50 pl-4 py-3 my-4 text-gray-600 rounded-r-lg"
                        />
                      ),
                      // 테이블
                      table: ({ node, ...props }: MarkdownComponentProps<"table">) => (
                        <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                          <table {...props} className="min-w-full text-sm divide-y divide-gray-200" />
                        </div>
                      ),
                      thead: ({ node, ...props }: MarkdownComponentProps<"thead">) => (
                        <thead {...props} className="bg-gray-50" />
                      ),
                      th: ({ node, ...props }: MarkdownComponentProps<"th">) => (
                        <th {...props} className="px-4 py-3 text-left font-semibold text-gray-900" />
                      ),
                      td: ({ node, ...props }: MarkdownComponentProps<"td">) => (
                        <td {...props} className="px-4 py-3 border-t border-gray-100 text-gray-600" />
                      ),
                      // 문단
                      p: ({ node, ...props }: MarkdownComponentProps<"p">) => (
                        <p {...props} className="mb-3 last:mb-0 leading-7" />
                      ),
                      // 제목 태그 스타일링
                      h1: ({ node, ...props }: MarkdownComponentProps<"h1">) => (
                        <h1 {...props} className="text-xl font-bold mt-6 mb-3 text-gray-900 border-b pb-2" />
                      ),
                      h2: ({ node, ...props }: MarkdownComponentProps<"h2">) => (
                        <h2 {...props} className="text-lg font-bold mt-5 mb-2 text-gray-800" />
                      ),
                      h3: ({ node, ...props }: MarkdownComponentProps<"h3">) => (
                        <h3 {...props} className="text-base font-bold mt-4 mb-2 text-gray-800" />
                      ),
                      hr: ({ node, ...props }: MarkdownComponentProps<"hr">) => (
                        <hr {...props} className="my-6 border-gray-200" />
                      ),
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
                    <span className="material-symbols-outlined text-[48px] text-gray-200">error_outline</span>
                    <p>제공된 요약 정보가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 모달 푸터 (닫기 버튼) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary transition-colors shadow-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}