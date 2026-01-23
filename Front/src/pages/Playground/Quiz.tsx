import { useEffect, useState } from "react";

type QuizQuestion = {
  questionId: number;
  question: string;
};

type QuizStatus = "question" | "result";

export default function Quiz() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answer, setAnswer] = useState<string>("");

    const [status, setStatus] = useState<QuizStatus>("question");

    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");

    const totalCount = questions.length;
    const currentQuestion = questions[currentIndex];


    useEffect(() => {
    const fetchQuiz = async () => {
        try {
        const res = await fetch("/api/games/quiz/start", {
            credentials: "include",
        });

        if (res.status === 401) {
            // 인증 안 된 경우
            alert("로그인이 필요합니다.");
            return;
        }

        if (!res.ok) {
            throw new Error("퀴즈 데이터를 불러오지 못했습니다.");
        }

        const data = await res.json();
        setQuestions(data.questions);
        } catch (error) {
        console.error(error);
        alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    fetchQuiz();
    }, []);


    const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    try {
        const res = await fetch("/api/games/quiz/answer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            questionId: currentQuestion.questionId,
            answer: answer,
        }),
        });

        if (res.status === 401) {
        alert("로그인이 필요합니다.");
        return;
        }

        if (!res.ok) {
        throw new Error("정답 확인에 실패했습니다.");
        }

        const data = await res.json();

        setIsCorrect(data.isCorrect);
        setCorrectAnswer(data.correctAnswer);
        setExplanation(data.explanation);
        setStatus("result");
    } catch (error) {
        console.error(error);
        alert("정답 확인 중 오류가 발생했습니다.");
    }
    };


  const handleNextQuestion = () => {
    setAnswer("");
    setIsCorrect(null);
    setCorrectAnswer("");
    setExplanation("");
    setStatus("question");
    setCurrentIndex((prev) => prev + 1);
  };

  const progressPercent =
    totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-primary font-bold text-lg">
                오늘의 퀴즈
              </span>
              <h3 className="text-2xl font-black mt-1">
                주거 용어 마스터하기
              </h3>
            </div>
            <span className="text-sm font-bold text-gray-500">
              문제{" "}
              <span className="text-primary text-lg">
                {currentIndex + 1}
              </span>{" "}
              / {totalCount}
            </span>
          </div>

          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question / Result Card */}
        <div className="glass w-full rounded-3xl p-10 md:p-16 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          {status === "question" && currentQuestion && (
            <>
              <div className="mb-8 w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">
                  quiz
                </span>
              </div>

              <h4 className="text-xl md:text-2xl font-bold leading-relaxed break-keep max-w-2xl">
                {currentQuestion.question}
              </h4>
            </>
          )}

          {status === "result" && (
            <>
              <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                <span className="material-symbols-outlined text-primary text-4xl">
                  {isCorrect ? "check" : "close"}
                </span>
              </div>

              <h4 className="text-2xl font-black mb-4">
                {isCorrect ? "정답입니다!" : "아쉽네요, 오답입니다."}
              </h4>

              <p className="text-lg font-bold mb-2">
                정답: {correctAnswer}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                {explanation}
              </p>
            </>
          )}
        </div>

        {/* Answer Input / Action */}
        {status === "question" && (
          <div className="w-full flex flex-col gap-6">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="정답을 입력해주세요"
              className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-bold transition-all"
            />

            <button
              type="button"
              onClick={handleSubmitAnswer}
              className="w-full py-5 rounded-2xl bg-primary text-white text-xl font-black shadow-xl shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              정답 확인
            </button>
          </div>
        )}

        {status === "result" && (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-5 rounded-2xl bg-primary text-white text-xl font-black shadow-xl shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            다음 문제로 이동
          </button>
        )}
      </div>
    </main>
  );
}
