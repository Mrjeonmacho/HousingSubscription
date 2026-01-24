import { useEffect, useState } from "react";

import QuizHeader from "../../components/playground/quiz/QuizHeader";
import QuizQuestionView from "../../components/playground/quiz/QuizQuestionView";
import QuizResultCorrect from "../../components/playground/quiz/QuizResultCorrect";
import QuizResultWrong from "../../components/playground/quiz/QuizResultWrong";

type QuizQuestion = {
  questionId: number;
  question: string;
};

type QuizStatus = "question" | "correct" | "wrong";

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [status, setStatus] = useState<QuizStatus>("question");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");

  const currentQuestion = questions[currentIndex];

  // ------------------------------------
  // 퀴즈 시작 API (백엔드 연결 전 → 주석)
  // ------------------------------------
  useEffect(() => {
    /*
    const fetchQuiz = async () => {
      const res = await fetch("/api/games/quiz/start", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setQuestions(data.questions);
    };

    fetchQuiz();
    */

    // 임시 더미 데이터 (화면 개발용)
    setQuestions([
      {
        questionId: 1,
        question:
          "전체 가구를 소득 순으로 나열했을 때 가운데에 해당하는 가구의 소득을 의미하는 기준은 무엇일까요?",
      },
    ]);
  }, []);

  // ------------------------------------
  // 정답 제출 (백엔드 연결 전 → 더미 처리)
  // ------------------------------------
  const handleSubmitAnswer = async () => {
    /*
    const res = await fetch("/api/games/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        questionId: currentQuestion.questionId,
        answer,
      }),
    });

    const data = await res.json();
    */

    // 임시 판별 로직
    const isCorrect = answer === "중위소득";

    setCorrectAnswer("중위소득");
    setExplanation(
      "중위소득은 모든 가구를 소득 순으로 나열했을 때 가운데에 위치한 가구의 소득을 의미합니다."
    );
    setStatus(isCorrect ? "correct" : "wrong");
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setCorrectAnswer("");
    setExplanation("");
    setStatus("question");
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <QuizHeader
          currentIndex={currentIndex}
          totalCount={questions.length}
        />

        {status === "question" && (
          <QuizQuestionView
            question={currentQuestion?.question}
            answer={answer}
            onChangeAnswer={setAnswer}
            onSubmit={handleSubmitAnswer}
          />
        )}

        {status === "correct" && (
          <QuizResultCorrect
            correctAnswer={correctAnswer}
            explanation={explanation}
            onNext={handleNextQuestion}
          />
        )}

        {status === "wrong" && (
          <QuizResultWrong
            answer={answer}
            correctAnswer={correctAnswer}
            explanation={explanation}
            onNext={handleNextQuestion}
          />
        )}
      </div>
    </main>
  );
}
