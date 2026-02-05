// Front/src/components/AlertModal.tsx
import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  title?: string;
  message: string;
  icon?: string;
  variant?: "default" | "danger";
  confirmText?: string;
  onConfirm: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  cancelText?: string;
};

export default function AlertModal({
  isOpen,
  title,
  message,
  icon,
  variant = "default",
  confirmText = "확인",
  onConfirm,
  onClose,
  isLoading = false,
  closeOnOverlayClick = false,
  closeOnEsc = true,
  cancelText,
}: Props) {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => confirmBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  // 1. 제목 색상 설정
  const titleColorClass = variant === "danger" ? "text-red-600" : "text-primary";

  // 2. 버튼 색상 설정
  const confirmBtnColorClass = variant === "danger"
    ? "bg-red-500 hover:bg-red-600 shadow-red-200" // Danger 스타일
    : "bg-primary hover:brightness-110";           // Default 스타일

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-scale-up">
        
        {/* 제목 영역 */}
        {title && (
          <h2 className={`mb-3 text-xl font-bold flex items-center gap-2 ${titleColorClass}`}>
            {icon && (
              <span className="material-symbols-outlined">{icon}</span>
            )}
            {title}
          </h2>
        )}

        <p className="mb-8 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>

        <div className="flex gap-3 mt-8">
          {/* 취소 버튼 */}
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-3.5 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
          )}

          {/* 확인 버튼 */}
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-[2] rounded-xl py-3.5 font-bold text-white shadow-lg transition-all disabled:opacity-50 ${confirmBtnColorClass}`}
          >
            {isLoading ? "처리 중..." : confirmText}
          </button>
        </div>
      </div>

      {closeOnOverlayClick && (
        <div
          className="absolute inset-0 -z-10"
          onClick={() => onClose?.()}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
