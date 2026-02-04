import type { AdminCreateNoticeRequest } from "../../../api/AdminNoticeApi";
import CardSection from "./NoticeFormCardSection";
import { TextField } from "./NoticeFormFields";
import { categoryLabel } from "../../../utils/noticeFormat";

type FieldErrors = Partial<Record<keyof AdminCreateNoticeRequest, string>>;

type Props = {
  form: AdminCreateNoticeRequest;
  errors: FieldErrors;
  onChange: <K extends keyof AdminCreateNoticeRequest>(
    key: K,
    value: AdminCreateNoticeRequest[K]
  ) => void;
};

export default function NoticeCreateAttachmentsSection({
  form,
  errors,
  onChange,
}: Props) {
  return (
    <CardSection title="첨부 파일 및 바로가기">
      <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
        입력하지 않은 항목은 정보 없음으로 처리됩니다.
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <TextField
          label="공고 PDF 링크"
          value={form.pdf}
          placeholder="https://...pdf"
          error={errors.pdf}
          helper="파일 업로드는 불가하며, 링크 저장을 권장합니다."
          onChange={(v) => onChange("pdf", v)}
        />

        <TextField
          label="공고 원본 링크"
          value={form.url}
          placeholder="https://..."
          error={errors.url}
          onChange={(v) => onChange("url", v)}
        />

        {/* 수정된 미리보기 섹션 (실선 버전) */}
        <div className="mt-2 rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-primary/60"></div> {/* 포인트 바 */}
            <p className="text-sm font-bold text-gray-700">실시간 미리보기</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
              <div className="col-span-2 border-b border-gray-50 pb-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  공고 제목
                </div>
                <div className={`mt-1 font-semibold break-words ${form.title ? 'text-gray-900' : 'text-gray-300'}`}>
                  {form.title || "제목을 입력해주세요"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  청약 기간
                </div>
                <div className="font-medium text-gray-800">
                  {form.start_date && form.end_date 
                    ? `${form.start_date} ~ ${form.end_date}`
                    : "-"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  공고 종류
                </div>
                <div className="font-medium text-gray-800">
                  {categoryLabel(form.category) || "-"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                className={[
                  "flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-all",
                  form.pdf
                    ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                    : "bg-gray-100 text-gray-400 pointer-events-none",
                ].join(" ")}
                href={form.pdf || undefined}
                target="_blank"
                rel="noreferrer"
              >
                PDF 바로가기
              </a>

              <a
                className={[
                  "flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm transition-all",
                  form.url
                    ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 pointer-events-none",
                ].join(" ")}
                href={form.url || undefined}
                target="_blank"
                rel="noreferrer"
              >
                원본 링크
              </a>
            </div>
          </div>
        </div>
      </div>
    </CardSection>
  );
}

