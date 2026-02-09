import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { categoryLabel } from "../../../utils/noticeFormat";
import {
  postPreferenceResult,
  type PreferenceAnswerItem,
  type PreferenceResultResponse,
} from "../../../api/PreferenceApi";

type PreferenceResultViewProps = {
  answers: Record<string, string>;
  onRestart?: () => void;
};

function MaterialIcon({
  name,
  className,
  sizePx,
}: {
  name: string;
  className?: string;
  sizePx?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontSize: sizePx ? `${sizePx}px` : undefined,
        lineHeight: 1,
        fontVariationSettings:
          "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48",
      }}
    >
      {name}
    </span>
  );
}

type ResultIconSet = {
  center: string;
  left: string;
  right: string;
};

const RESULT_ICON_MAP: Record<string, ResultIconSet> = {
  "안정 추구형": { center: "apartment", left: "subway", right: "directions_walk" },
  "자유 이동형": { center: "luggage", left: "swap_horiz", right: "directions_walk" },
  "비용 보수형": { center: "account_balance_wallet", left: "paid", right: "check_circle" },
  "기회 추구형": { center: "domain", left: "trending_up", right: "star" },
  "입지 우선형": { center: "place", left: "subway", right: "directions_bus" },
  "균형 추구형": { center: "balance", left: "domain", right: "paid" },
};

const DEFAULT_ICONS: ResultIconSet = {
  center: "domain",
  left: "subway",
  right: "directions_walk",
};

export default function PreferenceResultView({ answers, onRestart }: PreferenceResultViewProps) {
  const payloadAnswers: PreferenceAnswerItem[] = useMemo(() => {
    return Object.entries(answers).map(([questionKey, selectedOption]) => ({
      questionKey,
      selectedOption,
    }));
  }, [answers]);

  const navigate = useNavigate();

  const goNoticeList = () => {
    if (!data) return;

    navigate("/notices", {
      state: {
        preselectedCategories: data.recommendedCategories,
        scrollToList: true,
      },
    });
  };

  const [data, setData] = useState<PreferenceResultResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setErrorMsg("");

        const result = await postPreferenceResult(payloadAnswers, controller.signal);
        setData(result);
      } catch (e) {
        if ((e as { name?: string })?.name === "AbortError") return;
        const msg = (e as { message?: string })?.message || "네트워크 오류가 발생했습니다.";
        setErrorMsg(msg);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [payloadAnswers]);

  if (loading) {
    return (
      <section className="w-full">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-14 md:py-20 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-[#E3F6ED] px-5 py-2 text-sm font-bold text-primary mb-6">
            결과 계산 중
          </div>
          <h1 className="mt-2 text-2xl md:text-4xl font-extrabold text-gray-900">
            결과를 불러오고 있습니다
          </h1>
          <p className="mt-4 text-gray-500">잠시만 기다려 주세요.</p>
        </div>
      </section>
    );
  }

  if (errorMsg) {
    return (
      <section className="w-full">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-14 md:py-20 text-center">
          <div className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-100">
            오류
          </div>
          <h1 className="mt-8 text-2xl md:text-4xl font-extrabold text-gray-900">
            결과를 불러오지 못했습니다
          </h1>
          <p className="mt-4 text-gray-600">{errorMsg}</p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              다시 시도
            </button>

            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                className="rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                다시 테스트하기
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const icons = RESULT_ICON_MAP[data.preferenceType] ?? DEFAULT_ICONS;
  const highlightText = data.preferenceType;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-14 md:py-20">
        {/* 상단 타이틀 및 아이콘 섹션 (변경 없음) */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center rounded-full bg-[#E3F6ED] px-5 py-2 text-sm font-bold text-primary mb-6">
            테스트 완료!
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            당신의 주거 성향은:{" "}
            <span className="text-primary">'{highlightText}'</span>
          </h1>
        </div>

        <div className="relative mx-auto w-full max-w-lg aspect-square md:aspect-[5/4] bg-gradient-to-br from-primary/10 to-white p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-[40px] flex items-center justify-center mb-10 overflow-hidden">
          <div className="relative z-10 h-44 w-44 md:h-52 md:w-52 bg-white rounded-[40px] shadow-md flex items-center justify-center">
            <MaterialIcon name={icons.center} sizePx={120} className="text-gray-800" />
          </div>

          <div className="absolute left-[12%] bottom-[18%] animate-bounce">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center">
              <MaterialIcon name={icons.left} className="text-[28px] md:text-[32px] text-green-400" />
            </div>
          </div>

          <div className="absolute right-[12%] top-[20%] animate-bounce" style={{ animationDelay: "500ms" }}>
            <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center">
              <MaterialIcon name={icons.right} className="text-[26px] md:text-[30px] text-primary" />
            </div>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="korean-break text-gray-600 text-lg md:text-xl font-medium leading-relaxed break-keep">
            {data.summary}
          </p>
        </div>

        {/* 하단 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽 카드: 추천 공고 타입 */}
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-[#E3F6ED] flex items-center justify-center mb-6">
              <MaterialIcon name="place" className="text-[24px] text-primary" />
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 inline-block pb-1">
                추천하는 공고 타입
              </h2>
            </div>

            <ul className="text-gray-600 font-medium leading-relaxed mt-2 space-y-2 flex-1">
              {data.recommendedCategories.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <span className="text-gray-400 mt-1.5 text-[10px]">●</span>
                  <span className="korean-break break-keep">
                    {categoryLabel(c)}
                  </span>
                </li>
              ))}
            </ul>

            {/* ▼▼▼ 버튼 위치 이동 및 디자인 수정 (우측 하단, 배경 제거) ▼▼▼ */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={goNoticeList}
                // 배경색(bg-primary/10) 제거, 텍스트 색상 및 hover 효과 변경
                className="group flex items-center gap-1.5 py-2 px-1 rounded-full text-primary text-sm font-bold transition-all hover:text-primary font-semibold active:scale-95"
              >
                <span>관련 공고 보러가기</span>
                {/* 아이콘 이동 애니메이션은 유지 */}
                <div className="w-5 h-5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <MaterialIcon
                    name="arrow_forward"
                    className="text-[18px] leading-none"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* 오른쪽 카드: Check Point (변경 없음) */}
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E3F6ED] flex items-center justify-center mb-6">
              <MaterialIcon name="checklist" className="text-[24px] text-primary" />
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 inline-block pb-1">
                공고문 Check Point
              </h2>
            </div>

            <div className="mt-5 flex gap-3 items-start w-full">
              <div className="mt-0.5 min-w-[20px] h-5 w-5 flex items-center justify-center bg-white">
                <MaterialIcon name="check" className="text-[16px] text-primary leading-none" />
              </div>

              <p className="flex-1 korean-break text-gray-600 font-medium leading-relaxed break-keep">
                {data.noticeTip}
              </p>
            </div>
          </div>
        </div>

        {onRestart && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm md:text-base font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              다시 테스트하기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}