import type { Notice } from "../../pages/NoticesPage";
import { categoryLabel } from "../../utils/noticeFormat";

type Size = "sm" | "md" | "lg";

type Props = {
  category: Notice["category"] | string | null | undefined;
  size?: Size;
  className?: string;
};

function normalizeCategory(category: string | null | undefined) {
  if (!category) return null;

  // 백엔드/추천카테고리 값까지 커버
  switch (category) {
    case "YOUTH_RESIDENCE":
    case "YOUTH_HOUSING":
      return "YOUTH_RESIDENCE";

    case "HAPPY_HOUSE":
      return "HAPPY_HOUSE";

    case "NATIONAL_RENTAL":
      return "NATIONAL_RENTAL";

    case "PUBLIC_RENTAL":
      return "PUBLIC_RENTAL";

    case "LONG_TERM_RENTAL":
      return "LONG_TERM_RENTAL";

    case "SALE_HOUSE":
      return "SALE_HOUSE";

    default:
      return null;
  }
}

function categoryTone(category: string | null) {
  // 파스텔톤: 배경은 연하게, 글씨는 한 톤 진하게
  switch (category) {
    case "YOUTH_RESIDENCE": // 빨강
      return "bg-red-50 text-red-700 border-red-100";
    case "HAPPY_HOUSE": // 주황
      return "bg-orange-50 text-orange-700 border-orange-100";
    case "NATIONAL_RENTAL": // 노랑
      return "bg-amber-50 text-amber-800 border-amber-100";
    case "PUBLIC_RENTAL": // 초록
      return "bg-green-50 text-green-700 border-green-100";
    case "LONG_TERM_RENTAL": // 파랑
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "SALE_HOUSE": // 보라
      return "bg-purple-50 text-purple-700 border-purple-100";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function sizeClass(size: Size) {
  switch (size) {
    case "sm":
      return "px-2.5 py-1 text-[11px] font-semibold";
    case "md":
      return "px-3 py-1 text-xs font-semibold";
    case "lg":
      return "px-3.5 py-1.5 text-sm font-semibold";
  }
}

export default function CategoryBadge({ category, size = "md", className }: Props) {
  const normalized = normalizeCategory(category ?? undefined);
  const tone = categoryTone(normalized);
  const label = categoryLabel(category ?? undefined);

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full border",
        tone,
        sizeClass(size),
        className ?? "",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
