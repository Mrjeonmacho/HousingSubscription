import type { AdminCreateNoticeRequest } from "../../../api/AdminNoticeApi";
import type { NoticeCategory } from "../../../utils/noticeFormat";
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
  onChange,
}: Props) {
  return (
    <CardSection title="공고 기본 정보">
      <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
        필수 항목을 입력해 주세요.
      </div>
      <div className="mt-5 grid grid-cols-1 gap-8">
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

        <DateField
          label="공고 등록 일자"
          required
          value={form.reg_date}
          error={errors.reg_date}
          helper="SH 공식 홈페이지 내 공지사항 기준 일자입니다."
          onChange={(v) => onChange("reg_date", v)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateField
            label="청약 시작 일자"
            required
            value={form.start_date}
            error={errors.start_date}
            onChange={(v) => onChange("start_date", v)}
          />
          <DateField
            label="청약 마감 일자"
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
