import type { AdminCreateNoticeRequest } from "../../../api/AdminNoticeApi";
import CardSection from "./NoticeFormCardSection";
import { TextField, InfoItem } from "./NoticeFormFields";
import { categoryLabel, statusLabel } from "../../../utils/noticeFormat";

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
          helper="스펙상 JSON이므로 파일 업로드는 불가하며, 링크 저장을 권장합니다."
          onChange={(v) => onChange("pdf", v)}
        />

        <TextField
          label="공고 원본 링크"
          value={form.url}
          placeholder="https://..."
          error={errors.url}
          onChange={(v) => onChange("url", v)}
        />

        <div className="mt-1 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-sm font-semibold text-gray-800">미리보기</p>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <InfoItem label="번호" value={form.notice_no || "-"} />
            <InfoItem label="상태" value={statusLabel(form.status)} />
            <div className="col-span-2">
              <div className="text-xs text-gray-400">제목</div>
              <div className="font-medium text-gray-900 break-words">
                {form.title || "-"}
              </div>
            </div>
            <InfoItem
              label="기간"
              value={`${form.start_date} ~ ${form.end_date}`}
            />
            <InfoItem label="카테고리" value={categoryLabel(form.category)} />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a
              className={[
                "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                form.pdf
                  ? "bg-primary text-white hover:bg-primary/90"
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
                "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
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
    </CardSection>
  );
}
