// Front/src/components/notices/list/NoticeListHeader.tsx  => 검색결과, 전체 공고
import { useEffect, useRef, useState } from "react";
import type { SortType } from "./NoticeListLayout";

type Props = {
  totalCount: number;
  sortType: SortType;
  onChangeSort: (next: SortType) => void;
};

export default function NoticeListHeader({
  totalCount,
  sortType,
  onChangeSort,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="flex items-end justify-between px-1">
      <h3 className="text-xl font-bold text-gray-900 leading-none">
        검색결과 <span className="text-gray-900">({totalCount})</span>
      </h3>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="정렬"
        >
          {sortType === "REG_DATE" ? "최신 등록순" : "마감 임박순"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
            <button
              type="button"
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                onChangeSort("REG_DATE");
                setOpen(false);
              }}
            >
              최신 등록순
            </button>

            <button
              type="button"
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                onChangeSort("END_DATE");
                setOpen(false);
              }}
            >
              마감 임박순
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
