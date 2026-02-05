import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkDuplicate,
  sendVerificationCode,
  verifyCode,
  registerUser,
} from "../api/AuthApi";
import axios from "axios";

export default function SignupPage() {
  const navigate = useNavigate();

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
    isIdChecked: false, // 아이디 중복확인 완료 여부
    isEmailChecked: false, // 이메일 사용 가능 여부
    isEmailSent: false, // 이메일 전송 여부
    isEmailVerified: false, // 이메일 인증 완료 여부
    timeLeft: 300, // 타이머
  });

  // 실시간 아이디 중복 확인용 상태
  const [idMessage, setIdMessage] = useState(""); // 아이디 중복 메시지

  // 실시간 이메일 중복 확인용 상태
  const [emailMessage, setEmailMessage] = useState(""); // 이메일 중복 메시지

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
    // 아이디가 비어있거나 형식 에러가 있으면 검사 안 함
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

  // 실시간 이메일 중복 확인 (중복 useEffect 제거 + effect 동기 setState 제거)
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
    if (!formData.email) return alert("이메일을 입력해주세요.");
    if (errors.email) return alert("올바른 이메일 형식을 입력해주세요.");
    if (!status.isEmailChecked) return alert("이메일 중복 확인이 필요합니다.");

    try {
      await sendVerificationCode(formData.email);
      alert("인증번호가 전송되었습니다.");
      setStatus((prev) => ({
        ...prev,
        isEmailSent: true,
        isEmailVerified: false,
        timeLeft: 300,
      }));
    } catch (err: unknown) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (statusCode === 429) {
        alert("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      alert("인증번호 전송에 실패했습니다.");
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!formData.email) return;
    if (!formData.verificationCode) return;

    try {
      const result = await verifyCode(formData.email, formData.verificationCode);

      if (result.verified) {
        alert("이메일 인증이 완료되었습니다.");
        setStatus((prev) => ({ ...prev, isEmailVerified: true }));
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch (err: unknown) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (statusCode === 410) {
        alert("인증코드가 만료되었습니다. 재전송 해주세요.");
        return;
      }
      if (statusCode === 429) {
        alert("인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      alert("인증 확인에 실패했습니다.");
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
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    if (
      !formData.userId ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.name ||
      !formData.email
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (!status.isIdChecked) return alert("아이디 중복 확인을 해주세요.");
    if (formData.password !== formData.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!status.isEmailVerified) return alert("이메일 인증을 완료해주세요.");
    if (!isAllAgreed) return alert("필수 약관에 모두 동의해주세요.");

    const success = await registerUser(formData);
    if (success) {
      alert(`${formData.name}님, 회원가입이 완료되었습니다!`);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#111814] mb-2">
            서울집사에 오신 것을 환영합니다
          </h2>
          <p className="text-gray-500 font-medium">
            청년과 신혼부부를 위한 서울시 주거 지원 플랫폼
          </p>
        </div>

        <form className="space-y-6">
          {/* 아이디 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-700">아이디</label>
            <div className="relative">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 rounded-2xl border text-gray-900 placeholder:text-gray-300 ${
                  errors.userId
                    ? "border-red-500 focus:ring-red-200"
                    : status.isIdChecked
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                } outline-none transition-all`}
                placeholder="아이디를 입력해주세요"
              />
            </div>
            {(errors.userId || idMessage) && (
              <div className="mt-1 ml-1">
                {errors.userId ? (
                  <p className="text-red-500 text-xs">{errors.userId}</p>
                ) : (
                  <p
                    className={`text-xs font-bold min-h-5 ${
                      status.isIdChecked ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {idMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-2xl border text-gray-900 placeholder:text-gray-300 ${
                errors.password ? "border-red-500" : "border-gray-200"
              } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
              placeholder="8~20자 (소문자, 숫자, 특수문자 포함)"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-2xl border text-gray-900 placeholder:text-gray-300 ${
                isPasswordMismatch
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : isPasswordMatch
                  ? "border-green-500 focus:border-green-500 focus:ring-green-200"
                  : "border-gray-200 focus:border-primary focus:ring-primary/20"
              } outline-none transition-all`}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            {isPasswordMismatch && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            {isPasswordMatch && (
              <p className="text-green-500 text-sm mt-2 ml-1 font-medium">
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          {/* 이름 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
              placeholder="이름을 입력해주세요"
            />
          </div>

          {/* 이메일 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이메일
            </label>
            <div className="flex gap-3 mb-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={status.isEmailVerified}
                className={`flex-1 px-4 py-3.5 rounded-2xl border text-gray-900 placeholder:text-gray-300 ${
                  errors.email
                    ? "border-red-500"
                    : status.isEmailVerified
                    ? "bg-gray-50 text-gray-500 border-gray-200"
                    : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                } outline-none transition-all`}
                placeholder="example@email.com"
              />
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={status.isEmailVerified}
                className={`px-5 py-3.5 font-bold rounded-2xl transition-colors whitespace-nowrap text-sm ${
                  status.isEmailVerified
                    ? "bg-green-100 text-green-600 cursor-default"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
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
                    className={`text-xs font-bold min-h-5 ${
                      status.isEmailChecked ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {emailMessage}
                  </p>
                )}
              </div>
            )}

            {status.isEmailSent && !status.isEmailVerified && (
              <div className="flex gap-3 animate-fade-in-down">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="인증번호 6자리"
                    maxLength={6}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-red-500">
                    {formatTime(status.timeLeft)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-5 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors whitespace-nowrap text-sm"
                >
                  확인
                </button>
              </div>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mt-8">
            <div
              className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4 cursor-pointer"
              onClick={toggleAll}
            >
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  isAllAgreed
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
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
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      agreements.terms
                        ? "bg-gray-400 border-gray-400"
                        : "bg-white border-gray-300"
                    }`}
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
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      agreements.privacy
                        ? "bg-gray-400 border-gray-400"
                        : "bg-white border-gray-300"
                    }`}
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
            className="w-full bg-primary text-white font-bold text-lg h-14 rounded-2xl hover:brightness-105 shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
          >
            회원가입 완료
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
