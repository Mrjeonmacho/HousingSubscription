// Front/src/components/notices/list/NoticeListHeaderRow.tsx => 공고 테이블 헤더
export default function NoticeListHeaderRow() {
  return (
    <div className="hidden md:grid grid-cols-[150px_1fr_80px] items-center px-6 py-4 text-sm font-bold border-b border-gray-100 bg-gray-50">
      <div className="text-center">진행상태</div>
      <div className="text-center">공고명</div>
      <div className="text-center">관심공고</div>
    </div>
  );
}
