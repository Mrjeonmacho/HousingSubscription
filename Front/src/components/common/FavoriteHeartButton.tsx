import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";

type FavoriteHeartButtonProps = {
  isFavorite: boolean;
  isPending?: boolean;
  onToggle: () => void;

  isLoggedIn: boolean;

  className?: string;
  stopPropagation?: boolean;

  ariaLabelFavorite?: string;
  ariaLabelNotFavorite?: string;
};

export default function FavoriteHeartButton({
  isFavorite,
  isPending = false,
  onToggle,
  isLoggedIn,
  className,
  stopPropagation = true,
  ariaLabelFavorite = "찜 해제",
  ariaLabelNotFavorite = "찜",
}: FavoriteHeartButtonProps) {
  const navigate = useNavigate();

  const openAlert = useUIStore((s) => s.openAlert);

  const ariaLabel = isFavorite ? ariaLabelFavorite : ariaLabelNotFavorite;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation();

    if (!isLoggedIn) {
      openAlert({
        title: "로그인 안내",
        message: "로그인이 필요한 기능입니다.\n로그인 페이지로 이동하시겠습니까?",
        icon: "lock",
        
        confirmText: "로그인",
        cancelText: "아니오",
        
        onConfirm: () => {
          navigate("/login");
        },
      });
      return;
    }

    onToggle();
  };

  return (
    <button
      type="button"
      className={[
        "p-1 rounded-full transition-colors disabled:opacity-60",
        "hover:bg-gray-100",
        isFavorite
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-400",
        className ?? "",
      ].join(" ")}
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={isPending}
    >
      ❤
    </button>
  );
}
