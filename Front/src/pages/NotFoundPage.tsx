// Front/src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-6xl font-extrabold text-gray-800">404</h1>

      <p className="mb-2 text-xl font-semibold text-gray-700">
        페이지를 찾을 수 없습니다.
      </p>

      <p className="mb-8 text-gray-500">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          이전 페이지
        </button>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
