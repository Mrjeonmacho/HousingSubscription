// Front/src/components/noticeDetail/NoticeAiHelpCard.tsx
import { useNavigate } from "react-router-dom";

type Props = {
  noticeId: number | null;
  noticeTitle: string | null;
  disabled?: boolean;
};

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings:
          "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

export default function NoticeAiHelpCard({
  noticeId,
  noticeTitle,
  disabled = false,
}: Props) {
  const navigate = useNavigate();

  const isDisabled = disabled || !noticeId;

  return (
    <section className="rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <MaterialIcon name="smart_toy" className="text-white" />
        </span>
        <h3 className="text-base font-bold">AI 채팅 상담</h3>
      </div>

      <p className="mb-5 text-sm text-white/80">
        이 공고에 대해 궁금한 점이 있으신가요? 서울집사 AI가 24시간 답변해 드립니다.
      </p>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() =>
          navigate("/chatbot", {
            state: { noticeId, noticeTitle: noticeTitle ?? "" },
          })
        }
        className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-gray-600"
      >
        AI에게 물어보기
      </button>
    </section>
  );
}
