import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
};

export default function WithdrawModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-scale-up">
        <h2 className="mb-2 text-xl font-bold text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          회원 탈퇴
        </h2>
        
        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
          탈퇴 시 계정 정보와 모든 활동 내역이 <strong>영구적으로 삭제</strong>되며 복구할 수 없습니다.<br/>
          계속하시려면 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gray-100 py-3.5 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] rounded-xl bg-red-500 py-3.5 font-bold text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
            >
              {isLoading ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}