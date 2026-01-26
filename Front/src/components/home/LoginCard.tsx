import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginCard = (): React.ReactElement => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <div className="w-full max-w-xl text-center text-xs text-gray-600 font-sans">
      <div className="shadow-[0px_8px_30px_rgba(0,_0,_0,_0.06)] rounded-3xl bg-white p-10 overflow-hidden">
        <div className="space-y-6">
          <button className="w-full shadow-[0px_10px_15px_-3px_rgba(0,_230,_118,_0.2),_0px_4px_6px_-4px_rgba(0,_230,_118,_0.2)] rounded-3xl bg-primary h-14 overflow-hidden text-lg text-white font-bold hover:shadow-lg transition-shadow"
            onClick={handleLoginClick}>
            로그인
          </button>

          <div className="flex justify-center items-center gap-6 text-sm">
            <button className="leading-4 font-medium cursor-pointer hover:underline">
              아이디 찾기
            </button>
            <div className="w-px h-3 bg-gray-300" />
            <button className="leading-4 font-medium cursor-pointer hover:underline">
              비밀번호 찾기
            </button>
          </div>

          <div className="relative">
            <div className="border-t border-gray-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500 uppercase">
              또는
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p className="text-gray-600">아직 회원이 아니신가요?</p>
            <Link to="/signup" className="text-primary font-bold underline cursor-pointer hover:opacity-80 transition-opacity">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;