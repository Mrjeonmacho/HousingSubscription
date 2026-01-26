import { useEffect, useState } from "react";

import QuizHeader from "../../components/playground/quiz/QuizHeader";
import QuizQuestionView from "../../components/playground/quiz/QuizQuestionView";
import QuizResultCorrect from "../../components/playground/quiz/QuizResultCorrect";
import QuizResultWrong from "../../components/playground/quiz/QuizResultWrong";
import QuizResultDone from "../../components/playground/quiz/QuizResultDone";

type QuizQuestion = {
  questionId: number;
  question: string;
};

type QuizStatus = "question" | "correct" | "wrong" | "done";

type QuizAnswerResponse = {
  isCorrect?: boolean; // 백엔드가 isCorrect로 줄 수도 있고
  correct?: boolean;   // 실제로는 correct로 주고 있음
  correctAnswer?: string;
  explanation?: string;
};

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [status, setStatus] = useState<QuizStatus>("question");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");

  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch("/api/games/quiz/start", {
          credentials: "include",
        });
        if (!res.ok) return;

        const data = await res.json();

        // start 응답이 "배열 자체"로 오고 있음
        const list: QuizQuestion[] = Array.isArray(data)
          ? data
          : data?.questions ?? [];

        setQuestions(list);
        setCurrentIndex(0);
        setCorrectCount(0);
        setAnswer("");
        setCorrectAnswer("");
        setExplanation("");
        setStatus("question");
      } catch {
        // 필요 시 에러 처리 확장
      }
    };

    fetchQuiz();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    try {
      const res = await fetch("/api/games/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: currentQuestion.questionId,
          answer: answer.trim(),
        }),
      });

      if (!res.ok) return;

      const data: QuizAnswerResponse = await res.json();

      const isCorrect = (data.isCorrect ?? data.correct) ?? false;

      setCorrectAnswer(data.correctAnswer ?? "");
      setExplanation(data.explanation ?? "");
      setStatus(isCorrect ? "correct" : "wrong");

      if (isCorrect) setCorrectCount((prev) => prev + 1);
    } catch {
      // 필요 시 에러 처리 확장
    }
  };

  const handleNextQuestion = () => {
    const isLast = currentIndex >= questions.length - 1;

    setAnswer("");
    setCorrectAnswer("");
    setExplanation("");

    if (isLast) {
      setStatus("done");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setStatus("question");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswer("");
    setCorrectAnswer("");
    setExplanation("");
    setStatus("question");
  };

  // 로딩 처리
  if (questions.length === 0) {
    return (
      <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex items-center justify-center">
        <div className="text-gray-600">문제를 불러오는 중입니다.</div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <QuizHeader
          currentIndex={Math.min(currentIndex, questions.length - 1)}
          totalCount={questions.length}
        />

        {status === "done" && (
          <QuizResultDone
            totalCount={questions.length}
            correctCount={correctCount}
            onRestart={handleRestart}
          />
        )}

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
            nextLabel={isLastQuestion ? "결과 확인" : "다음 문제로 이동"}
          />
        )}

        {status === "wrong" && (
          <QuizResultWrong
            answer={answer}
            correctAnswer={correctAnswer}
            explanation={explanation}
            onNext={handleNextQuestion}
            nextLabel={isLastQuestion ? "결과 확인" : "다음 문제로 이동"}
          />
        )}
      </div>
    </main>
  );
}
