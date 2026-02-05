import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserBasicInfo, updateUserBasicInfo, getUserAddInfo, updateUserAddInfo } from "../api/UserApi"; 
import type { UserAddInfo } from "../types/user";
import { withdrawAccount, confirmPasswordAPI } from "../api/AuthApi";
import WithdrawModal from "../components/modals/WithdrawModal";

// 기본 정보 폼 타입
interface BasicFormState {
  userName: string;
  loginId: string;
  email: string;
  authType: string;
}

// 모든 필드를 string으로 관리, 전송 시 변환
interface AddInfoFormState {
  birthDate: string;
  targetType: string;
  marriageStatus: string;
  childCount: string;
  houseOwn: string;
  asset: string;
  income: string;
}

export default function MyPage() {
  const { updateUserState } = useAuth();
  const navigate = useNavigate();

  // 기본 정보 State
  const [isBasicEditing, setIsBasicEditing] = useState(false);

  // 저장된 기본 정보
  const [savedBasicData, setSavedBasicData] = useState<BasicFormState>({
    userName: "",
    loginId: "",
    email: "",
    authType: "",
  });

  // 폼 입력값 관리
  const [basicFormData, setBasicFormData] = useState<BasicFormState>({
    userName: "",
    loginId: "",
    email: "",
    authType: "",
  });

  // 탈퇴 모달 상태 관리
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  // 탈퇴 버튼 클릭 시 모달 열기
  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  // 모달에서 비밀번호 입력 후 "탈퇴하기" 눌렀을 때 실행
  const handleFinalWithdraw = async (password: string) => {
    setIsWithdrawLoading(true);
    try {
      // 비밀번호 검증 API 호출
      const isVerified = await confirmPasswordAPI(password);
      
      if (!isVerified) {
        alert("비밀번호가 일치하지 않습니다.");
        setIsWithdrawLoading(false);
        return;
      }

      // 검증 성공 시 실제 탈퇴 API 호출
      await withdrawAccount();

      // 성공 처리
      localStorage.clear();
      alert("회원 탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다.");
      window.location.href = "/";

    } catch (error) {
      console.error("탈퇴 프로세스 실패:", error);
      alert("탈퇴 처리에 실패했습니다. 다시 시도해주세요."); // 소셜 로그인 유저 등 예외 처리
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicFormData.userName || !basicFormData.email) {
      alert("이름과 이메일은 필수입니다.");
      return;
    }

    // API 호출
    try {
      await updateUserBasicInfo({
        userName: basicFormData.userName,
        email: basicFormData.email
      });

      updateUserState({
        userName: basicFormData.userName
      });

      setSavedBasicData({
        ...basicFormData,
        loginId: savedBasicData.loginId 
      });

      alert("저장되었습니다!");
      setIsBasicEditing(false);
      
      navigate(0); // 페이지 새로고침
    } catch (error) {
      console.error("기본 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }
  };

  // 추가 정보 State
  const [isAddInfoEditing, setIsAddInfoEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  
  // 초기값을 모두 빈 문자열("")로 설정
  const [addInfoFormData, setAddInfoFormData] = useState<AddInfoFormState>({
    birthDate: "",
    targetType: "",
    marriageStatus: "",
    childCount: "",
    houseOwn: "", 
    asset: "",
    income: "",
  });

  // 조회용 데이터
  const [savedData, setSavedData] = useState<UserAddInfo>({
    birthDate: null,
    targetType: null,
    marriageStatus: null,
    childCount: null,
    houseOwn: null,
    asset: null,
    income: null,
  });

  // 페이지 접속 시 기존 추가 정보 로딩
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 두 API를 병렬로 동시에 요청
        const [basicData, addData] = await Promise.all([
          getUserBasicInfo(), // 기본 정보
          getUserAddInfo()    // 추가 정보
        ]);
        console.log("Fetched UserAddInfo:", addData);
        setSavedData(addData); // 화면 표시용 데이터 업데이트
        
        setSavedBasicData({
          userName: basicData.userName,
          loginId: basicData.loginId,
          email: basicData.email,
          authType: basicData.authType,
        });

        setBasicFormData({
          userName: basicData.userName,
          loginId: basicData.loginId,
          email: basicData.email,
          authType: basicData.authType,
        });

        // 수정 모드 진입 시 폼에 채워넣을 데이터 세팅 (null -> "")
        setAddInfoFormData({
          birthDate: addData.birthDate || "",
          targetType: addData.targetType || "",
          marriageStatus: addData.marriageStatus || "",
          childCount: addData.childCount !== null ? String(addData.childCount) : "",
          houseOwn: addData.houseOwn || "",
          asset: addData.asset !== null ? String(addData.asset) : "",
          income: addData.income !== null ? String(addData.income) : "",
        });
        console.log("추가 정보 로딩 완료:", addData);
      } catch (error) {
        console.error("추가 정보 로딩 실패:", error);
        // 데이터가 없어도 에러는 아닐 수 있음 (처음 입력하는 경우 등)
      }
    };
    fetchAllData();
  }, []);

  const handleAddInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddInfoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 빈 문자열이면 null, 값이 있으면 정확한 타입
    const payload: UserAddInfo = {
      birthDate: addInfoFormData.birthDate === "" ? null : addInfoFormData.birthDate,
      
      targetType: addInfoFormData.targetType === "" 
        ? null 
        : (addInfoFormData.targetType as UserAddInfo["targetType"]),
      
      marriageStatus: addInfoFormData.marriageStatus === "" 
        ? null 
        : (addInfoFormData.marriageStatus as UserAddInfo["marriageStatus"]),
      
      childCount: addInfoFormData.childCount === "" ? null : Number(addInfoFormData.childCount),
      
      houseOwn: addInfoFormData.houseOwn === "" 
        ? null 
        : (addInfoFormData.houseOwn as UserAddInfo["houseOwn"]),
      
      asset: addInfoFormData.asset === "" ? null : Number(addInfoFormData.asset),
      income: addInfoFormData.income === "" ? null : Number(addInfoFormData.income),
    };

    console.log("서버로 전송될 데이터:", payload);
    try{
      // API 호출
      await updateUserAddInfo(payload); // PUT 호출
      alert("성공적으로 수정되었습니다!");
      setSavedData(payload); // 화면 표시용 데이터 업데이트
      setIsAddInfoEditing(false);
    } catch (error) {
      console.error("추가 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 값 표시용
  const getDisplayValue = (key: string, value: string | number | boolean | null) => {
    if (value === null || value === "") return <span className="text-gray-300 font-normal">미입력</span>;

    if (key === "targetType") {
      if (value === "STUDENT") return "대학생";
      if (value === "YOUTH") return "청년";
      if (value === "NEWLYWED") return "신혼부부";
      return value;
    }
    if (key === "marriageStatus") {
      if (value === "SINGLE") return "미혼";
      if (value === "MARRIED") return "기혼";
      return "결혼 예정";
    }
    if (key === "houseOwn") {
      if (value === "YES") return "보유";
      if (value === "NO") return "미보유";
      return value;
    }
    if (key === "childCount") return `${value}명`;
    if (key === "asset" || key === "income") return `${Number(value).toLocaleString()}만원`; // 천단위 콤마 살짝 추가
    
    return value;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      {/* 탈퇴 모달 컴포넌트 */}
      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleFinalWithdraw}
        isLoading={isWithdrawLoading}
      />
      
      {/* 중앙 집중형 컨테이너 (max-w-3xl) */}
      <div className="max-w-3xl w-full flex flex-col gap-10">
        
        {/* 상단 헤더 섹션: 이름 강조 */}
        <div className="border-b border-gray-100 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-primary">{savedBasicData.userName}</span>님, 반갑습니다!
          </h1>
          <p className="text-gray-500 mt-2">서울집사에서 맞춤형 주거 지원 정보를 관리해보세요.</p>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <main className="space-y-12">
          
          {/* 1. 기본 정보 섹션 */}
          <section className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">badge</span>
                기본 계정 정보
              </h2>
              {!isBasicEditing && (
                <button 
                  onClick={() => setIsBasicEditing(true)}
                  className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  수정
                </button>
              )}
            </div>
            
            <div className="p-6 sm:p-8">
                {isBasicEditing ? (
                <form onSubmit={handleBasicSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">이름</label>
                        <input 
                            type="text" 
                            name="userName" 
                            value={basicFormData.userName} 
                            onChange={handleBasicChange} 
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">아이디</label>
                        <input 
                            type="text" 
                            value={basicFormData.loginId} 
                            disabled 
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed outline-none" 
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">이메일</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={basicFormData.email}
                                onChange={handleBasicChange}
                                disabled={!!savedBasicData.authType && savedBasicData.authType !== "LOCAL"}
                                className={`w-full px-4 py-3.5 rounded-xl border border-transparent transition-all outline-none
                                    ${savedBasicData.authType && savedBasicData.authType !== "LOCAL"
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    }
                                `}
                            />
                            {/* 소셜 아이콘 표시 */}
                            {savedBasicData.authType && savedBasicData.authType !== "LOCAL" && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                </div>
                            )}
                        </div>
                        {savedBasicData.authType && savedBasicData.authType !== "LOCAL" && (
                        <p className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg inline-block mt-2">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            소셜 로그인 사용자는 이메일을 변경할 수 없습니다.
                        </p>
                        )}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={() => {
                            setIsBasicEditing(false); 
                            setBasicFormData(savedBasicData); 
                            }} 
                            className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                        >
                            변경사항 저장
                        </button>
                    </div>
                </form>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div>
                        <p className="text-xs font-medium text-gray-400 mb-1.5">이름</p>
                        <p className="font-bold text-lg text-gray-900">{savedBasicData.userName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400 mb-1.5">아이디</p>
                        <p className="font-bold text-lg text-gray-900 font-mono">{savedBasicData.loginId}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <p className="text-xs font-medium text-gray-400 mb-1.5">이메일</p>
                        <p className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
                            {savedBasicData.email}
                        </p>
                    </div>
                </div>
                )}
            </div>
          </section>

          {/* 2. 추가 정보 섹션 */}
          <section className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    맞춤형 정보
                </h2>
                <p className="text-xs text-gray-500 mt-1 ml-7">청약 및 지원 공고 추천을 위한 정보입니다.</p>
              </div>
              {!isAddInfoEditing && (
                <button 
                  onClick={() => setIsAddInfoEditing(true)}
                  className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  수정
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8">
                {isAddInfoEditing ? (
                <form onSubmit={handleAddInfoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                    <div className="col-span-1 md:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3 mb-2">
                        <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                        <p className="text-sm text-blue-600 leading-relaxed">
                            입력하지 않은 항목은 <strong>'정보 없음'</strong>으로 처리되어 추천 정확도가 낮아질 수 있습니다.<br/>
                            가능한 정확한 정보를 입력해주세요.
                        </p>
                    </div>
                    
                    {/* 생년월일 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">생년월일</label>
                        <input type="date" name="birthDate" value={addInfoFormData.birthDate} onChange={handleAddInfoChange} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                    </div>

                    {/* 대상 유형 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">대상 유형</label>
                        <div className="relative">
                            <select name="targetType" value={addInfoFormData.targetType} onChange={handleAddInfoChange} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                                <option value="">선택 안 함</option>
                                <option value="STUDENT">대학생</option>
                                <option value="YOUTH">청년</option>
                                <option value="NEWLYWED">신혼부부</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* 혼인 상태 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">혼인 상태</label>
                        <div className="relative">
                            <select name="marriageStatus" value={addInfoFormData.marriageStatus} onChange={handleAddInfoChange} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                                <option value="">선택 안 함</option>
                                <option value="SINGLE">미혼</option>
                                <option value="MARRIED">기혼</option>
                                <option value="PLANNED">결혼 예정</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* 자녀 수 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">자녀 수</label>
                        <div className="relative">
                            <input type="number" name="childCount" value={addInfoFormData.childCount} onChange={handleAddInfoChange} placeholder="0" min="0" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">명</span>
                        </div>
                    </div>

                    {/* 자산 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">총 자산</label>
                        <div className="relative">
                            <input type="text" name="asset" value={addInfoFormData.asset} onChange={handleAddInfoChange} placeholder="0" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">만원</span>
                        </div>
                    </div>

                    {/* 소득 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">월 소득</label>
                        <div className="relative">
                            <input type="text" name="income" value={addInfoFormData.income} onChange={handleAddInfoChange} placeholder="0" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">만원</span>
                        </div>
                    </div>

                    {/* 무주택 여부 */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">주택 보유 여부</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${addInfoFormData.houseOwn === 'NO' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                <input type="radio" name="houseOwn" value="NO" checked={addInfoFormData.houseOwn === "NO"} onChange={handleAddInfoChange} className="hidden" />
                                <span className="material-symbols-outlined">check_circle</span>
                                미보유 (무주택)
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${addInfoFormData.houseOwn === 'YES' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                <input type="radio" name="houseOwn" value="YES" checked={addInfoFormData.houseOwn === "YES"} onChange={handleAddInfoChange} className="hidden" />
                                <span className="material-symbols-outlined">home</span>
                                보유
                            </label>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => setIsAddInfoEditing(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">취소</button>
                        <button type="submit" disabled={isLoading} className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                            {isLoading ? "저장 중..." : "정보 수정 완료"}
                        </button>
                    </div>
                </form>
                ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_month</span>생년월일</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("birthDate", savedData.birthDate)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">face</span>대상 유형</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("targetType", savedData.targetType)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">diversity_3</span>혼인 상태</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("marriageStatus", savedData.marriageStatus)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">child_care</span>자녀 수</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("childCount", savedData.childCount)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>총 자산</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("asset", savedData.asset)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">attach_money</span>월 소득</span>
                        <span className="text-lg font-bold text-gray-900">{getDisplayValue("income", savedData.income)}</span>
                    </div>
                    
                    <div className="col-span-2 md:col-span-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                <span className="material-symbols-outlined">home</span>
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold mb-0.5 uppercase tracking-wide">Housing Status</p>
                                <p className="text-green-900 font-bold text-lg">주택 보유 여부</p>
                            </div>
                        </div>
                        <div className="px-5 py-2 bg-white rounded-xl shadow-sm border border-green-100 text-green-700 font-bold">
                            {getDisplayValue("houseOwn", savedData.houseOwn)}
                        </div>
                    </div>
                </div>
                )}
            </div>
          </section>

          {/* 3. 하단 위험 구역 (탈퇴 버튼) */}
          <div className="pt-8 flex justify-center border-t border-gray-100">
            <button
                onClick={handleWithdrawClick}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors px-4 py-2"
            >
                회원 탈퇴를 원하시나요?
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
