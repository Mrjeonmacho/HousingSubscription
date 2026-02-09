// Front/src/pages/Checkin/Quiz.tsx
import { useEffect, useState } from "react";

import QuizHeader from "../../components/checkin/quiz/QuizHeader";
import QuizQuestionView from "../../components/checkin/quiz/QuizQuestionView";
import QuizResultCorrect from "../../components/checkin/quiz/QuizResultCorrect";
import QuizResultWrong from "../../components/checkin/quiz/QuizResultWrong";
import QuizResultDone from "../../components/checkin/quiz/QuizResultDone";

import {
  getQuizStart,
  submitQuizAnswer,
  getApiErrorMessage,
  type QuizQuestion,
} from "../../api/QuizApi";

type QuizStatus = "question" | "correct" | "wrong" | "done";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const [status, setStatus] = useState<QuizStatus>("question");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");

  const [correctCount, setCorrectCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    let ignore = false;

    const fetchQuiz = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const list = await getQuizStart();
        if (ignore) return;

        setQuestions(
          list.map((q) => ({
            ...q,
            options: shuffle(q.options ?? []),
          }))
        );
        setCurrentIndex(0);
        setCorrectCount(0);
        setSelectedOptionId(null);
        setCorrectAnswer("");
        setExplanation("");
        setStatus("question");
      } catch (e) {
        if (ignore) return;
        setErrorMessage(getApiErrorMessage(e));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    if (selectedOptionId == null) return;

    try {
      const data = await submitQuizAnswer({
        questionId: currentQuestion.questionId,
        selectedOptionId,
      });

      setCorrectAnswer(data.correctAnswer ?? "");
      setExplanation(data.explanation ?? "");
      setStatus(data.correct ? "correct" : "wrong");

      if (data.correct) setCorrectCount((prev) => prev + 1);
    } catch {
      // 필요 시 에러 처리 확장
    }
  };

  const handleNextQuestion = () => {
    const isLast = currentIndex >= questions.length - 1;

    setSelectedOptionId(null);
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
    setSelectedOptionId(null);
    setCorrectAnswer("");
    setExplanation("");
    setStatus("question");
  };

  if (loading) {
    return (
      <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex items-center justify-center">
        <div className="text-gray-600">문제를 불러오는 중입니다.</div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex items-center justify-center">
        <div className="text-gray-600">{errorMessage}</div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex-1 px-4 md:px-20 lg:px-40 py-12 flex items-center justify-center">
        <div className="text-gray-600">표시할 문제가 없습니다.</div>
      </main>
    );
  }

  const selectedText =
    selectedOptionId == null
      ? ""
      : currentQuestion?.options.find((o) => o.optionId === selectedOptionId)?.text ?? "";

  return (
    <main className="flex-1 px-4 md:px-12 lg:px-16 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-2">
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
            options={currentQuestion?.options ?? []}
            selectedOptionId={selectedOptionId}
            onChangeOption={setSelectedOptionId}
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
            answer={selectedText}
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
