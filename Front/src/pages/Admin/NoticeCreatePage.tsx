import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { getIsAdmin } from "../../api/UserApi";
import {
  postAdminCreateNotice,
  type AdminCreateNoticeRequest,
} from "../../api/AdminNoticeApi";

import type { NoticeCategory, NoticeStatus } from "../../utils/noticeFormat";
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";

import NoticeCreateHeader from "../../components/admin/notice-form/NoticeFormHeader";
import NoticeCreateBasicInfoSection from "../../components/admin/notice-form/NoticeFormBasicInfoSection";
import NoticeCreateAttachmentsSection from "../../components/admin/notice-form/NoticeFormAttachmentsSection";
import NoticeCreateActions from "../../components/admin/notice-form/NoticeFormActions";

type FieldErrors = Partial<Record<keyof AdminCreateNoticeRequest, string>>;

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

const CATEGORY_VALUES: NoticeCategory[] = [
  "YOUTH_RESIDENCE",
  "HAPPY_HOUSE",
  "NATIONAL_RENTAL",
  "PUBLIC_RENTAL",
  "LONG_TERM_RENTAL",
  "SALE_HOUSE",
];

const STATUS_VALUES: NoticeStatus[] = [
  "TO_BE_ANNOUNCED",
  "RECEIVING",
  "DEADLINE_APPROACHING",
  "COMPLETED",
];

function todayYYYYMMDD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isValidDateString(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function compareDate(a: string, b: string) {
  return a.localeCompare(b);
}

export default function NoticeCreatePage() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState<AdminCreateNoticeRequest>(() => ({
    notice_no: "",
    title: "",
    category: "YOUTH_RESIDENCE",
    reg_date: todayYYYYMMDD(),
    status: "RECEIVING",
    start_date: todayYYYYMMDD(),
    end_date: todayYYYYMMDD(),
    pdf: "",
    url: "",
  }));

  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    (async () => {
      try {
        const ok = await Promise.resolve(getIsAdmin());
        setAllowed(Boolean(ok));
        if (!ok) navigate("/notices", { replace: true });
      } finally {
        setChecking(false);
      }
    })();
  }, [navigate]);

  const categoryOptions = useMemo(
    () => CATEGORY_VALUES.map((v) => ({ value: v, label: categoryLabel(v) })),
    []
  );

  const statusOptions = useMemo(
    () => STATUS_VALUES.map((v) => ({ value: v, label: statusLabel(v) })),
    []
  );

  const onChange = <K extends keyof AdminCreateNoticeRequest>(
    key: K,
    value: AdminCreateNoticeRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError(null);
  };

  const validate = (v: AdminCreateNoticeRequest) => {
    const next: FieldErrors = {};

    if (!v.notice_no.trim()) next.notice_no = "공고 등록 번호는 필수입니다.";
    if (!v.title.trim()) next.title = "공고 제목은 필수입니다.";

    if (!v.category) next.category = "공고 종류를 선택해 주세요.";
    if (!v.status) next.status = "공고 상태를 선택해 주세요.";

    if (!v.reg_date || !isValidDateString(v.reg_date))
      next.reg_date = "등록일을 올바르게 입력해 주세요.";
    if (!v.start_date || !isValidDateString(v.start_date))
      next.start_date = "시작일을 올바르게 입력해 주세요.";
    if (!v.end_date || !isValidDateString(v.end_date))
      next.end_date = "마감일을 올바르게 입력해 주세요.";

    if (isValidDateString(v.start_date) && isValidDateString(v.end_date)) {
      if (compareDate(v.start_date, v.end_date) > 0) {
        next.end_date = "마감일은 시작일 이후여야 합니다.";
      }
    }

    if (v.pdf && !/^https?:\/\//.test(v.pdf)) {
      next.pdf =
        "PDF 링크(https://...)를 입력해 주세요. (파일 경로를 쓰는 경우는 백엔드 정책에 따릅니다)";
    }
    if (v.url && !/^https?:\/\//.test(v.url)) {
      next.url = "원본 링크는 https://... 형태로 입력해 주세요.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (submitting) return;

    setServerError(null);
    if (!validate(form)) return;

    try {
      setSubmitting(true);
      const data = await postAdminCreateNotice(form);
      navigate(`/notices/${data.id}`, { replace: true });
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>;
      const msg =
        err.response?.data?.message ||
        err.message ||
        "요청 처리 중 오류가 발생했습니다.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => navigate(-1);

  if (checking) return null;
  if (!allowed) return null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6">
      <NoticeCreateHeader
        title="SH 공고 등록"
        subtitle="필수 항목을 입력해 주세요."
        serverError={serverError}
        onBack={onCancel}
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NoticeCreateBasicInfoSection
          form={form}
          errors={errors}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          onChange={onChange}
        />

        <NoticeCreateAttachmentsSection
          form={form}
          errors={errors}
          onChange={onChange}
        />
      </section>

      <NoticeCreateActions
        submitting={submitting}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </main>
  );
}
