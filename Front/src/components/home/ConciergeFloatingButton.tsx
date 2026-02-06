import { useNavigate } from "react-router-dom";

export default function ConciergeFloatingButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/checkin")}
      className="
        fixed bottom-6 right-6 z-50
        /* group: 자식 요소들의 호버 상태를 제어하기 위해 필수 */
        group
        /* 기본 형태: 원형 (h-14 등 고정 높이 사용) */
        flex h-14 items-center p-1
        rounded-full
        bg-[#2ED573] text-white
        shadow-md
        /* overflow-hidden: 텍스트가 숨겨질 때 밖으로 튀어나가지 않게 함 */
        overflow-hidden
        /* 호버 시 배경색 살짝 어둡게 */
        hover:bg-[#25AB5B]
        active:scale-95
        /* 부드러운 확장을 위한 트랜지션 설정 (cubic-bezier로 고급스러운 느낌) */
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
      "
    >
      {/* 아이콘 컨테이너 */}
      <div className="
        flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20
        /* 호버 시 회전 (tilt) 효과 */
        group-hover:rotate-[15deg]
        transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
      ">
        <span className="material-symbols-outlined text-[24px]">
          concierge
        </span>
      </div>

      {/* 텍스트 컨테이너 (숨겨졌다 나타나는 부분) */}
      <div className="
        /* 초기 상태: 너비 0, 투명도 0 */
        max-w-0 opacity-0
        /* 호버 상태: 너비 확장 (충분히 큰 값 지정), 투명도 100% */
        group-hover:max-w-[200px] group-hover:opacity-100
        /* 텍스트 줄바꿈 방지 */
        whitespace-nowrap
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
      ">
        {/* 텍스트에 패딩을 주어 아이콘과 간격 확보 */}
        <span className="pl-3 pr-5 text-[15px] font-bold leading-tight">
          처음 오셨나요?
        </span>
      </div>
    </button>
  );
}