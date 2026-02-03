// Front/src/pages/Admin/NoticeUpdatePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";

import { getIsAdmin } from "../../api/UserApi";
import { getNoticeDetail } from "../../api/NoticeApi";
import {
  patchAdminUpdateNotice,
  type AdminCreateNoticeRequest,
} from "../../api/AdminNoticeApi";

import type { NoticeCategory, NoticeStatus } from "../../utils/noticeFormat";
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";

import NoticeFormHeader from "../../components/admin/notice-form/NoticeFormHeader";
import NoticeFormBasicInfoSection from "../../components/admin/notice-form/NoticeFormBasicInfoSection";
import NoticeFormAttachmentsSection from "../../components/admin/notice-form/NoticeFormAttachmentsSection";
import NoticeFormActions from "../../components/admin/notice-form/NoticeFormActions";

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

// NoticeDetail(카멜/스네이크 혼재 가능) -> AdminCreateNoticeRequest(스네이크)로 변환
function toEditForm(detail: {
  noticeNo: string | null;
  title: string;
  category: string | null;
  regDate: string | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  pdfUrl: string | null;
  url: string | null;
}): AdminCreateNoticeRequest {
  return {
    notice_no: detail.noticeNo ?? "",
    title: detail.title ?? "",
    category: (detail.category ?? "YOUTH_RESIDENCE") as NoticeCategory,
    reg_date: detail.regDate ?? todayYYYYMMDD(),
    status: (detail.status ?? "RECEIVING") as NoticeStatus,
    start_date: detail.startDate ?? todayYYYYMMDD(),
    end_date: detail.endDate ?? todayYYYYMMDD(),
    pdf: detail.pdfUrl ?? "",
    url: detail.url ?? "",
  };
}

export default function NoticeUpdatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const noticeId = Number(params.noticeId);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

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

  useEffect(() => {
    try {
      if (!Number.isFinite(noticeId) || noticeId <= 0) {
        navigate("/notices", { replace: true });
        return;
      }

      const ok = getIsAdmin();
      setAllowed(ok);

      if (!ok) navigate(`/notices/${noticeId}`, { replace: true });
    } finally {
      setChecking(false);
    }
  }, [navigate, noticeId]);

  // 기존 공고 데이터 로딩
  useEffect(() => {
    if (checking) return;
    if (!allowed) return;

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setServerError(null);

        const detail = await getNoticeDetail(noticeId);

        if (ignore) return;

        setForm(
          toEditForm({
            noticeNo: detail.noticeNo ?? null,
            title: detail.title ?? "",
            category: detail.category ?? null,
            regDate: detail.regDate ?? null,
            status: detail.status ?? null,
            startDate: detail.startDate ?? null,
            endDate: detail.endDate ?? null,
            pdfUrl: detail.pdfUrl ?? null,
            url: detail.url ?? null,
          })
        );
      } catch (e) {
        if (ignore) return;
        const err = e as AxiosError<ApiErrorResponse>;
        const msg =
          err.response?.data?.message ||
          err.message ||
          "공고 정보를 불러오는 중 오류가 발생했습니다.";
        setServerError(msg);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [checking, allowed, noticeId]);

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
      const data = await patchAdminUpdateNotice(noticeId, form);

      // 수정 API 응답이 NoticeResponseDto 형태면 id가 들어옵니다.
      const nextId = (data as { id?: number }).id ?? noticeId;

      navigate(`/notices/${nextId}`, { replace: true });
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
      <NoticeFormHeader
        title="SH 공고 수정"
        subtitle="수정할 항목을 변경한 뒤 저장해 주세요."
        serverError={serverError}
        onBack={onCancel}
      />

      {/* 로딩 중이면 섹션만 스켈레톤/비활성 처리하고 싶으면 컴포넌트 내부에서 disabled 처리도 가능 */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NoticeFormBasicInfoSection
          form={form}
          errors={errors}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          onChange={onChange}
        />

        <NoticeFormAttachmentsSection
          form={form}
          errors={errors}
          onChange={onChange}
        />
      </section>

      <NoticeFormActions
        submitting={submitting || loading}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </main>
  );
}
