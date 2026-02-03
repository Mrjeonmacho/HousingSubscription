// Front/src/components/notices/list/NoticeListHeader.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SortType } from "./NoticeListLayout";
import { getIsAdmin } from "../../../api/UserApi";

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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => getIsAdmin());

  useEffect(() => {
    const sync = () => setIsAdmin(getIsAdmin());

    // 같은 탭에서 로그인/로그아웃 반영 (커스텀 이벤트)
    window.addEventListener("auth-changed", sync);

    // 다른 탭에서 변경 반영 (storage 이벤트)
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  
  // 드롭다운 바깥 클릭 시 닫기 (원래 로직 복구)
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

  const onClickCreateNotice = () => {
    navigate("/admin/notices/create");
  };

  return (
    <div className="flex items-baseline justify-between px-1">
      <div className="flex items-baseline gap-3">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          검색결과 <span className="text-gray-900">({totalCount})</span>
        </h3>

        {isAdmin && (
          <button
            type="button"
            onClick={onClickCreateNotice}
            className="group inline-flex items-center px-1 text-[11px] text-gray-400 transition-colors hover:text-primary"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 mr-1.5 group-hover:border-primary">+</span>
            공고 등록
          </button>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="h-9 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
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
