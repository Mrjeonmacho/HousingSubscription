type PreferenceQuestionProps = {
  title: string;
};

export default function PreferenceQuestion({
  title,
}: PreferenceQuestionProps) {
  return (
    <section className="w-full max-w-3xl mx-auto text-center mb-4 px-4">
      {/* Question Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug break-keep whitespace-normal">
        {title}
      </h1>

      {/* Description (fixed text) */}
      <p className="mt-4 text-sm md:text-base text-gray-500">
        가장 본인의 성향에 가까운 답변을 하나 선택해 주세요.
      </p>
    </section>
  );
}
