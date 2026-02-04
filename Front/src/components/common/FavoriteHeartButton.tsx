import { useNavigate } from "react-router-dom";

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

  const ariaLabel = isFavorite ? ariaLabelFavorite : ariaLabelNotFavorite;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation();

    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
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
