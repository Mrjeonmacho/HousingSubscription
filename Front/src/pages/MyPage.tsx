import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAddInfo, updateUserAddInfo } from "../api/UserApi"; // API 연동 시 주석 해제
import type { UserAddInfo } from "../types/user";

// 기본 정보 폼 타입
interface BasicFormState {
  userName: string;
  loginId: string;
  email: string;
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 기본 정보 State
  const [isBasicEditing, setIsBasicEditing] = useState(false);
  const [basicFormData, setBasicFormData] = useState<BasicFormState>({
    userName: user?.userName || "김서울",
    loginId: "seoul_dummy_01",
    email: "dummy@example.com"
  });

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  useEffect(() => {
    if (user?.userName && basicFormData.userName !== user.userName) {
      setBasicFormData(prev => ({ ...prev, userName: user.userName }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userName]);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicFormData.userName || !basicFormData.email) {
      alert("이름과 이메일은 필수입니다.");
      return;
    }
    alert("저장되었습니다!");
    setIsBasicEditing(false);
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
    const fetchData = async () => {
      try {
        const data = await getUserAddInfo();
        console.log("Fetched UserAddInfo:", data);
        setSavedData(data); // 화면 표시용 데이터 업데이트

        // 수정 모드 진입 시 폼에 채워넣을 데이터 세팅 (null -> "")
        setAddInfoFormData({
          birthDate: data.birthDate || "",
          targetType: data.targetType || "",
          marriageStatus: data.marriageStatus || "",
          childCount: data.childCount !== null ? String(data.childCount) : "",
          houseOwn: data.houseOwn || "",
          asset: data.asset !== null ? String(data.asset) : "",
          income: data.income !== null ? String(data.income) : "",
        });
        console.log("추가 정보 로딩 완료:", data);
      } catch (error) {
        console.error("추가 정보 로딩 실패:", error);
        // 데이터가 없어도 에러는 아닐 수 있음 (처음 입력하는 경우 등)
      }
    };
    fetchData();
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
    if (value === null || value === "") return <span className="text-gray-300">미입력</span>;

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
    if (key === "asset" || key === "income") return `${value}만원`;
    
    return value;
  };

  return (
    <div className="min-h-screen bg-white p-8 flex justify-center">
      <div className="max-w-6xl w-full flex gap-8">
        
        {/* [왼쪽 사이드바] */}
        <div className="w-64 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-xl mb-6 text-gray-900">마이페이지</h2>
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-green-50 text-primary font-bold rounded-xl">
                👤 내 정보 관리
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                ❤️ 찜한 공고
              </button>
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* [오른쪽 메인 콘텐츠] */}
        <div className="flex-1 space-y-6">
          
          {/* 상단 프로필 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{basicFormData.userName}님</h1>
              <p className="text-gray-500">Seoul Jibsa Housing Support Member</p>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">기본 정보</h2>
              {!isBasicEditing && (
                <button 
                  onClick={() => setIsBasicEditing(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  수정하기
                </button>
              )}
            </div>
            {isBasicEditing ? (
              <form onSubmit={handleBasicSubmit} className="grid grid-cols-2 gap-6 animate-fade-in-down">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                  <input type="text" name="userName" value={basicFormData.userName} onChange={handleBasicChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">아이디</label>
                  <input type="text" value={basicFormData.loginId} disabled className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-100 text-gray-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
                  <input type="email" name="email" value={basicFormData.email} onChange={handleBasicChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-gray-900 focus:border-primary outline-none" />
                </div>
                <div className="col-span-2 flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsBasicEditing(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">취소</button>
                  <button type="submit" className="flex-2 py-3.5 rounded-2xl font-bold text-white bg-primary hover:brightness-105 shadow-lg shadow-primary/30 transition-all">저장하기</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-8 animate-fade-in-up">
                <div><p className="text-sm text-gray-400 mb-1">이름</p><p className="font-bold text-lg text-gray-900">{basicFormData.userName}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">아이디</p><p className="font-bold text-lg text-gray-900">{basicFormData.loginId}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">이메일</p><p className="font-bold text-lg text-gray-900">{basicFormData.email}</p></div>
              </div>
            )}
          </div>

          {/* 추가 정보 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                추가 정보
              </h2>
              {!isAddInfoEditing && (
                <button 
                  onClick={() => setIsAddInfoEditing(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  수정하기
                </button>
              )}
            </div>

            {isAddInfoEditing ? (
              <form onSubmit={handleAddInfoSubmit} className="grid grid-cols-2 gap-6 animate-fade-in-down">
                <div className="col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                  <p className="text-sm text-gray-500">
                    * 입력하지 않은 항목은 <strong>정보 없음</strong>으로 처리됩니다.
                  </p>
                </div>
                
                {/* 생년월일 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">생년월일</label>
                  <input type="date" name="birthDate" value={addInfoFormData.birthDate} onChange={handleAddInfoChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none" />
                </div>

                {/* 대상 유형 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">대상 유형</label>
                  <select name="targetType" value={addInfoFormData.targetType} onChange={handleAddInfoChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none appearance-none">
                    <option value="">선택 안 함</option>
                    <option value="STUDENT">대학생</option>
                    <option value="YOUTH">청년</option>
                    <option value="NEWLYWED">신혼부부</option>
                  </select>
                </div>

                {/* 혼인 상태 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">혼인 상태</label>
                  <select name="marriageStatus" value={addInfoFormData.marriageStatus} onChange={handleAddInfoChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none">
                    <option value="">선택 안 함</option>
                    <option value="SINGLE">미혼</option>
                    <option value="MARRIED">기혼</option>
                    <option value="PLANNED">결혼 예정</option>
                  </select>
                </div>

                {/* 자녀 수 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">자녀 수</label>
                  <input type="number" name="childCount" value={addInfoFormData.childCount} onChange={handleAddInfoChange} placeholder="입력 안 함" min="0" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none" />
                </div>

                {/* 자산 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">총 자산 (만원)</label>
                  <input type="text" name="asset" value={addInfoFormData.asset} onChange={handleAddInfoChange} placeholder="입력 안 함" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none" />
                </div>

                {/* 소득 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">월 소득 (만원)</label>
                  <input type="text" name="income" value={addInfoFormData.income} onChange={handleAddInfoChange} placeholder="입력 안 함" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none" />
                </div>

                {/* 무주택 여부 */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">주택 보유 여부</label>
                  <select name="houseOwn" value={addInfoFormData.houseOwn} onChange={handleAddInfoChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none">
                    <option value="">선택 안 함</option>
                    <option value="NO">미보유</option>
                    <option value="YES">보유</option>
                  </select>
                </div>

                <div className="col-span-2 flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsAddInfoEditing(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">취소</button>
                  <button type="submit" disabled={isLoading} className="flex-[2] py-3.5 rounded-2xl font-bold text-white bg-primary hover:brightness-105 shadow-lg shadow-primary/30 transition-all disabled:opacity-50">
                    {isLoading ? "저장 중..." : "저장하기"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 animate-fade-in-up">
                <div><p className="text-sm text-gray-400 mb-1">생년월일</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("birthDate", savedData.birthDate)}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">대상 유형</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("targetType", savedData.targetType)}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">혼인 상태</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("marriageStatus", savedData.marriageStatus)}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">자녀 수</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("childCount", savedData.childCount)}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">총 자산</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("asset", savedData.asset)}</p></div>
                <div><p className="text-sm text-gray-400 mb-1">월 소득</p><p className="font-bold text-lg text-gray-900">{getDisplayValue("income", savedData.income)}</p></div>
                <div className="col-span-2 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm"><span className="material-symbols-outlined">home</span></div>
                  <div><p className="text-xs text-green-600 font-bold mb-0.5">주거 상태</p><p className="text-green-800 font-bold">{getDisplayValue("houseOwn", savedData.houseOwn)}</p></div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}