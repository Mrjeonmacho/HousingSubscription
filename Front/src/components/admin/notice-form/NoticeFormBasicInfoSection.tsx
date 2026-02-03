import type { AdminCreateNoticeRequest } from "../../../api/AdminNoticeApi";
import type { NoticeCategory, NoticeStatus } from "../../../utils/noticeFormat";
import CardSection from "./NoticeFormCardSection";
import { TextField, SelectField, DateField } from "./NoticeFormFields";

type FieldErrors = Partial<Record<keyof AdminCreateNoticeRequest, string>>;

type Props = {
  form: AdminCreateNoticeRequest;
  errors: FieldErrors;

  categoryOptions: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;

  onChange: <K extends keyof AdminCreateNoticeRequest>(
    key: K,
    value: AdminCreateNoticeRequest[K]
  ) => void;
};

export default function NoticeCreateBasicInfoSection({
  form,
  errors,
  categoryOptions,
  statusOptions,
  onChange,
}: Props) {
  return (
    <CardSection title="공고 기본 정보">
      <div className="grid grid-cols-1 gap-4">
        <TextField
          label="공고 등록 번호"
          required
          value={form.notice_no}
          placeholder="예) SH-2026-004"
          error={errors.notice_no}
          onChange={(v) => onChange("notice_no", v)}
        />

        <TextField
          label="공고 제목"
          required
          value={form.title}
          placeholder="예) [청년형] 특화형 매입임대주택 입주자 모집"
          error={errors.title}
          onChange={(v) => onChange("title", v)}
        />

        <SelectField
          label="공고 종류"
          required
          value={form.category}
          options={categoryOptions}
          error={errors.category}
          onChange={(v) => onChange("category", v as NoticeCategory)}
        />

        <SelectField
          label="공고 상태"
          required
          value={form.status}
          options={statusOptions}
          error={errors.status}
          onChange={(v) => onChange("status", v as NoticeStatus)}
        />

        <DateField
          label="공고 등록 일자"
          required
          value={form.reg_date}
          error={errors.reg_date}
          onChange={(v) => onChange("reg_date", v)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateField
            label="공고 시작 일자"
            required
            value={form.start_date}
            error={errors.start_date}
            onChange={(v) => onChange("start_date", v)}
          />
          <DateField
            label="공고 마감 일자"
            required
            value={form.end_date}
            error={errors.end_date}
            onChange={(v) => onChange("end_date", v)}
          />
        </div>
      </div>
    </CardSection>
  );
}
