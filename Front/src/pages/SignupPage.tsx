import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkDuplicate,
  sendVerificationCode,
  verifyCode,
  registerUser,
} from "../api/AuthApi";
import axios from "axios";
import { useUIStore } from "../store/uiStore";

export default function SignupPage() {
  const navigate = useNavigate();
  // 전역 모달 함수 가져오기
  const openAlert = useUIStore((state) => state.openAlert);

  // 입력 데이터
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    verificationCode: "",
  });

  // 유효성 검사
  const [errors, setErrors] = useState({
    userId: "",
    password: "",
    email: "",
  });

  // 진행 상태 관리
  const [status, setStatus] = useState({
    isIdChecked: false,
    isEmailChecked: false,
    isEmailSent: false,
    isEmailVerified: false,
    timeLeft: 300,
  });

  const [idMessage, setIdMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  // 약관 동의
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  // 비밀번호 일치 여부 계산
  const isPasswordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;
  const isPasswordMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const isAllAgreed = agreements.terms && agreements.privacy;

  // 실시간 아이디 중복 확인
  useEffect(() => {
    if (!formData.userId || errors.userId) return;

    const timer = window.setTimeout(async () => {
      try {
        const result = await checkDuplicate("loginId", formData.userId);

        if (result.available) {
          setIdMessage("사용 가능한 아이디입니다.");
          setStatus((prev) => ({ ...prev, isIdChecked: true }));
        } else {
          setIdMessage("이미 사용 중인 아이디입니다.");
          setStatus((prev) => ({ ...prev, isIdChecked: false }));
        }
      } catch (error) {
        console.error("중복 확인 에러:", error);
        setIdMessage("중복 확인 중 오류가 발생했습니다.");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.userId, errors.userId]);

  // 실시간 이메일 중복 확인
  useEffect(() => {
    if (!formData.email || errors.email || status.isEmailVerified) return;

    const timer = window.setTimeout(async () => {
      try {
        const result = await checkDuplicate("email", formData.email);

        if (result.available) {
          setEmailMessage("사용 가능한 이메일입니다.");
          setStatus((prev) => ({ ...prev, isEmailChecked: true }));
        } else {
          setEmailMessage("이미 사용 중인 이메일입니다.");
          setStatus((prev) => ({ ...prev, isEmailChecked: false }));
        }
      } catch (error) {
        console.error("중복 확인 에러:", error);
        setEmailMessage("중복 확인 중 오류가 발생했습니다.");
        setStatus((prev) => ({ ...prev, isEmailChecked: false }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.email, errors.email, status.isEmailVerified]);

  // 타이머
  useEffect(() => {
    let timer: number;
    if (status.isEmailSent && !status.isEmailVerified && status.timeLeft > 0) {
      timer = window.setInterval(() => {
        setStatus((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status.isEmailSent, status.isEmailVerified, status.timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  // 유효성 검사
  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "userId") {
      const idRegex = /^[a-zA-Z0-9]+$/;
      if (!value) errorMessage = "";
      else if (!idRegex.test(value))
        errorMessage = "아이디는 영문과 숫자만 사용할 수 있습니다.";
      else if (value.length > 50) errorMessage = "아이디는 50자 이하여야 합니다.";
    } else if (name === "password") {
      const pwRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
      if (!value) errorMessage = "";
      else if (!pwRegex.test(value)) {
        errorMessage = "8~20자, 소문자/숫자/특수문자(!@#$%^&*) 포함 필수";
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMessage = "";
      else if (!emailRegex.test(value))
        errorMessage = "올바른 이메일 형식이 아닙니다.";
    }

    return errorMessage;
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    if (name === "userId") {
      setIdMessage("");
      setStatus((prev) => ({ ...prev, isIdChecked: false }));
    }

    if (name === "email") {
      setEmailMessage("");
      setStatus((prev) => ({
        ...prev,
        isEmailSent: false,
        isEmailVerified: false,
        isEmailChecked: false,
        timeLeft: 300,
      }));
      setFormData((prev) => ({ ...prev, verificationCode: "" }));
    }
  };

  // 이메일 인증번호 전송
  const handleSendVerification = async () => {
    if (!formData.email) {
      openAlert({ title: "입력 오류", message: "이메일을 입력해주세요.", icon: "warning", variant: "danger" });
      return;
    }
    if (errors.email) {
      openAlert({ title: "입력 오류", message: "올바른 이메일 형식을 입력해주세요.", icon: "warning", variant: "danger" });
      return;
    }
    if (!status.isEmailChecked) {
      openAlert({ title: "중복 확인 필요", message: "이메일 중복 확인이 완료되지 않았습니다.", icon: "info" });
      return;
    }

    try {
      await sendVerificationCode(formData.email);
      // 전송 성공
      openAlert({ title: "전송 완료", message: "인증번호가 전송되었습니다.\n이메일을 확인해주세요.", icon: "mark_email_read" });
      
      setStatus((prev) => ({
        ...prev,
        isEmailSent: true,
        isEmailVerified: false,
        timeLeft: 300,
      }));
    } catch (err: unknown) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (statusCode === 429) {
        openAlert({ title: "전송 실패", message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", icon: "error", variant: "danger" });
        return;
      }

      openAlert({ title: "전송 실패", message: "인증번호 전송에 실패했습니다.", icon: "error", variant: "danger" });
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!formData.email) return;
    if (!formData.verificationCode) return;

    try {
      const result = await verifyCode(formData.email, formData.verificationCode);

      if (result.verified) {
        // 인증 성공
        openAlert({ title: "인증 성공", message: "이메일 인증이 완료되었습니다.", icon: "check_circle" });
        setStatus((prev) => ({ ...prev, isEmailVerified: true }));
      } else {
        openAlert({ title: "인증 실패", message: "인증번호가 올바르지 않습니다.", icon: "error", variant: "danger" });
      }
    } catch (err: unknown) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (statusCode === 410) {
        openAlert({ title: "시간 초과", message: "인증코드가 만료되었습니다. 재전송 해주세요.", icon: "schedule", variant: "danger" });
        return;
      }
      if (statusCode === 429) {
        openAlert({ title: "횟수 초과", message: "인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.", icon: "error", variant: "danger" });
        return;
      }

      openAlert({ title: "오류 발생", message: "인증 확인에 실패했습니다.", icon: "error", variant: "danger" });
    }
  };

  // 약관 토글
  const toggleAll = () => {
    const newValue = !isAllAgreed;
    setAgreements({ terms: newValue, privacy: newValue });
  };
  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 최종 회원가입 요청
  const handleSignup = async () => {
    if (Object.values(errors).some((msg) => msg !== "")) {
      openAlert({ title: "입력 확인", message: "입력 정보를 다시 확인해주세요.", icon: "warning", variant: "danger" });
      return;
    }

    if (
      !formData.userId ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.name ||
      !formData.email
    ) {
      openAlert({ title: "입력 확인", message: "모든 필수 정보를 입력해주세요.", icon: "edit", variant: "danger" });
      return;
    }

    if (!status.isIdChecked) {
      openAlert({ title: "중복 확인", message: "아이디 중복 확인이 필요합니다.", icon: "person_search", variant: "danger" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      openAlert({ title: "비밀번호 불일치", message: "비밀번호가 일치하지 않습니다.", icon: "lock_reset", variant: "danger" });
      return;
    }
    if (!status.isEmailVerified) {
      openAlert({ title: "이메일 미인증", message: "이메일 인증을 완료해주세요.", icon: "mail", variant: "danger" });
      return;
    }
    if (!isAllAgreed) {
      openAlert({ title: "약관 동의", message: "필수 약관에 모두 동의해주세요.", icon: "assignment", variant: "danger" });
      return;
    }

    const success = await registerUser(formData);
    if (success) {
      // 가입 완료 (축하 아이콘)
      openAlert({
        title: "가입 완료",
        message: `${formData.name}님, 회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.`,
        icon: "celebration",
        onConfirm: () => {
          navigate("/login");
        }
      });
    }
  };

  return (
    <div className="bg-white flex flex-col items-center my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 md:p-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <img
              src="/seouljibsa.png"
              alt="서울집사 로고"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#111814] mb-1">
            서울집사 회원가입
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            청년과 신혼부부를 위한 맞춤형 주거지원 서비스
          </p>
        </div>

        <form className="space-y-5">
          {/* 아이디 */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-800 ml-1">
              아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[22px]">
                  person
                </span>
              </div>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={[
                  "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-gray-900 outline-none transition-all placeholder:text-gray-300",
                  errors.userId
                    ? "border-red-500 focus:ring-4 focus:ring-red-200/40"
                    : status.isIdChecked
                    ? "border-primary focus:ring-4 focus:ring-primary/10"
                    : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10",
                ].join(" ")}
                placeholder="아이디를 입력해주세요"
              />
            </div>

            {(errors.userId || idMessage) && (
              <div className="mt-1 ml-1">
                {errors.userId ? (
                  <p className="text-red-500 text-xs">{errors.userId}</p>
                ) : (
                  <p
                    className={[
                      "text-xs font-bold min-h-5",
                      status.isIdChecked ? "text-primary" : "text-red-500",
                    ].join(" ")}
                  >
                    {idMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-800 ml-1">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[22px]">
                  lock
                </span>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={[
                  "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-gray-900 outline-none transition-all placeholder:text-gray-300",
                  errors.password
                    ? "border-red-500 focus:ring-4 focus:ring-red-200/40"
                    : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10",
                ].join(" ")}
                placeholder="8~20자 (소문자, 숫자, 특수문자 포함)"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-800 ml-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[22px]">
                  lock
                </span>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={[
                  "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-gray-900 outline-none transition-all placeholder:text-gray-300",
                  isPasswordMismatch
                    ? "border-red-500 focus:ring-4 focus:ring-red-200/40"
                    : isPasswordMatch
                    ? "border-primary focus:ring-4 focus:ring-primary/10"
                    : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10",
                ].join(" ")}
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </div>

            {isPasswordMismatch && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            {isPasswordMatch && (
              <p className="text-primary text-xs mt-1 ml-1 font-medium">
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          {/* 이름 */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-800 ml-1">
              이름
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[22px]">
                  badge
                </span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-300"
                placeholder="이름을 입력해주세요"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-800 ml-1">
              이메일
            </label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-[22px]">
                    mail
                  </span>
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.isEmailVerified}
                  className={[
                    "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-gray-900 outline-none transition-all placeholder:text-gray-300",
                    errors.email
                      ? "border-red-500 focus:ring-4 focus:ring-red-200/40"
                      : status.isEmailVerified
                      ? "bg-gray-50 text-gray-500 border-gray-200"
                      : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10",
                  ].join(" ")}
                  placeholder="example@email.com"
                />
              </div>

              <button
                type="button"
                onClick={handleSendVerification}
                disabled={status.isEmailVerified}
                className={[
                  "px-5 h-[52px] font-bold rounded-2xl transition-colors whitespace-nowrap text-sm",
                  status.isEmailVerified
                    ? "bg-primary/15 text-primary cursor-default"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                ].join(" ")}
              >
                {status.isEmailVerified
                  ? "인증 완료"
                  : status.isEmailSent
                  ? "재전송"
                  : "인증번호 전송"}
              </button>
            </div>

            {(errors.email || emailMessage) && (
              <div className="mt-1 ml-1">
                {errors.email ? (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                ) : (
                  <p
                    className={[
                      "text-xs font-bold min-h-5",
                      status.isEmailChecked ? "text-primary" : "text-red-500",
                    ].join(" ")}
                  >
                    {emailMessage}
                  </p>
                )}
              </div>
            )}

            {status.isEmailSent && !status.isEmailVerified && (
              <div className="flex gap-3 mt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-300"
                    placeholder="인증번호 6자리"
                    maxLength={6}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-red-500">
                    {formatTime(status.timeLeft)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-5 h-[52px] bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors whitespace-nowrap text-sm"
                >
                  확인
                </button>
              </div>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mt-2">
            <div
              className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4 cursor-pointer"
              onClick={toggleAll}
            >
              <div
                className={[
                  "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  isAllAgreed
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300",
                ].join(" ")}
              >
                {isAllAgreed && (
                  <span className="material-symbols-outlined text-white text-sm font-bold">
                    check
                  </span>
                )}
              </div>
              <span className="font-bold text-gray-800">전체 동의</span>
            </div>

            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleAgreement("terms")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                      agreements.terms
                        ? "bg-gray-400 border-gray-400"
                        : "bg-white border-gray-300",
                    ].join(" ")}
                  >
                    {agreements.terms && (
                      <span className="material-symbols-outlined text-white text-[10px] font-bold">
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    이용약관 동의 (필수)
                  </span>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  chevron_right
                </span>
              </div>

              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleAgreement("privacy")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                      agreements.privacy
                        ? "bg-gray-400 border-gray-400"
                        : "bg-white border-gray-300",
                    ].join(" ")}
                  >
                    {agreements.privacy && (
                      <span className="material-symbols-outlined text-white text-[10px] font-bold">
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    개인정보 수집 동의 (필수)
                  </span>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  chevron_right
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignup}
            className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
          >
            회원가입 완료
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline ml-1">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
