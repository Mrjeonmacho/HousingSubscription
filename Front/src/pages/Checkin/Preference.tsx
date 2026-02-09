// Preference.tsx
import { useMemo, useState } from "react";
import PreferenceHeader from "../../components/checkin/preference/PreferenceHeader";
import PreferenceQuestion from "../../components/checkin/preference/PreferenceQuestion";
import PreferenceOptionList from "../../components/checkin/preference/PreferenceOptionList";
import PreferenceFooterNav from "../../components/checkin/preference/PreferenceFooterNav";
import PreferenceResultView from "../../components/checkin/preference/PreferenceResultView";
import { preferenceQuestions } from "../../data/preferenceQuestions";

type AnswerMap = Record<string, string>;

export default function Preference() {
  const total = preferenceQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = preferenceQuestions[currentIndex];

  const selectedValue = useMemo(() => {
    if (!currentQuestion) return "";
    return answers[currentQuestion.questionKey] ?? "";
  }, [answers, currentQuestion]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = Boolean(selectedValue);

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionKey]: value,
    }));
  };

  const handlePrev = () => {
    if (!canGoPrev) return;
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!canGoNext) return;

    const isLast = currentIndex >= total - 1;
    if (isLast) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <main className="flex-1">
        <PreferenceResultView answers={answers} onRestart={handleRestart} />
      </main>
    );
  }

  if (!currentQuestion) return null;

  return (
    <main className="flex-1 px-4 md:px-12 lg:px-16 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <PreferenceHeader
          currentIndex={currentIndex}
          total={total}
          category={currentQuestion.category}
        />

        <PreferenceQuestion title={currentQuestion.title} />

        <PreferenceOptionList
          options={currentQuestion.options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
        />

        <PreferenceFooterNav
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={handlePrev}
          onNext={handleNext}
          nextLabel={currentIndex === total - 1 ? "결과 보기" : "다음 질문으로"}
        />
      </div>
    </main>
  );
}
