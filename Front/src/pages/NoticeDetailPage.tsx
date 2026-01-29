// Front/src/pages/NoticeDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { apiClient } from "../api/axiosConfig";

import type { Notice } from "./NoticesPage";

import NoticeDetailHeader from "../components/noticeDetail/NoticeDetailHeader";
import NoticeOverviewCard from "../components/noticeDetail/NoticeOverviewCard";
import NoticeAiHelpCard from "../components/noticeDetail/NoticeAiHelpCard";
import NoticeQuickLinksCard from "../components/noticeDetail/NoticeQuickLinksCard";

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

function calcDDay(endDate: string | null) {
  if (!endDate) return null;
  const today = new Date();
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function normalizeNoticeDetail(data: unknown): Notice {
  const d = (data ?? {}) as Record<string, unknown>;

  return {
    id: Number(d.id),
    noticeNo: (d.noticeNo ?? d.no ?? null) as string | null,
    title: (d.title ?? "") as string,
    category: (d.category ?? null) as Notice["category"],
    regDate: (d.regDate ?? d.reg_date ?? null) as string | null,
    status: (d.status ?? null) as Notice["status"],
    startDate: (d.startDate ?? d.start_date ?? null) as string | null,
    endDate: (d.endDate ?? d.end_date ?? null) as string | null,
    pdfUrl: (d.pdfUrl ?? d.pdf ?? null) as string | null,
    url: (d.url ?? null) as string | null,
  };
}

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedId = useMemo(() => {
    const n = Number(noticeId);
    return Number.isFinite(n) ? n : NaN;
  }, [noticeId]);

  const dday = useMemo(() => {
    if (!notice) return null;
    return calcDDay(notice.endDate);
  }, [notice]);

  useEffect(() => {
    if (!noticeId || Number.isNaN(parsedId)) {
      setLoading(false);
      setErrorMessage("잘못된 요청입니다. ID는 숫자여야 합니다.");
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const res = await apiClient.get<unknown>(`/notices/${parsedId}`);
        if (ignore) return;

        const normalized = normalizeNoticeDetail(res.data);
        setNotice(normalized);
      } catch (e) {
        if (ignore) return;

        const err = e as AxiosError<ApiErrorResponse>;
        const msg =
          err.response?.data?.message ??
          (err.response?.status === 404
            ? "해당 공고를 찾을 수 없습니다."
            : "내부 서버 오류입니다.");

        setErrorMessage(msg);
        setNotice(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [noticeId, parsedId]);

  const onBack = () => navigate("/notices");

  const onShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: notice?.title ?? "공고 상세",
          url,
        });
        return;
      }
    } catch {
      // 공유 취소 등은 무시
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("링크를 복사했습니다.");
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const onFavorite = () => {
    alert("찜 기능은 다음 단계에서 연결할게요.");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <NoticeDetailHeader
        title={notice?.title ?? "공고 상세"}
        status={notice?.status ?? null}
        dday={dday}
        loading={loading}
        onBack={onBack}
        onFavorite={onFavorite}
        onShare={onShare}
      />

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
        <NoticeOverviewCard
        loading={loading}
        notice={
            notice
            ? {
                no: notice.noticeNo ?? null,
                reg_date: notice.regDate ?? null,
                category: notice.category ?? null,
                status: notice.status ?? null,
                start_date: notice.startDate ?? null,
                end_date: notice.endDate ?? null,
                }
            : null
        }
        />
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="h-[420px] w-full bg-gray-50 flex items-center justify-center text-sm text-gray-400">
              지도 영역 (추후 네이버/카카오 지도 컴포넌트로 교체)
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <NoticeQuickLinksCard
            loading={loading}
            pdf={notice?.pdfUrl ?? null}
            url={notice?.url ?? null}
          />

          <NoticeAiHelpCard
            noticeId={notice?.id ?? null}
            noticeTitle={notice?.title ?? null}
            disabled={loading || Boolean(errorMessage)}
          />
        </div>
      </div>
    </div>
  );
}
