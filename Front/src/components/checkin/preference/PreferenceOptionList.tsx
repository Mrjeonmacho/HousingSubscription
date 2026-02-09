import type { PreferenceOptionItem } from "../../../data/preferenceQuestions";

type PreferenceOptionListProps = {
  options: PreferenceOptionItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export default function PreferenceOptionList({
  options,
  selectedValue,
  onSelect,
}: PreferenceOptionListProps) {
  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <ul className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <li
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={[
                "flex items-center justify-between",
                "w-full px-6 py-5 rounded-2xl cursor-pointer",
                "border transition-colors",
                isSelected
                  ? "bg-primary/10 border-primary"
                  : "bg-white border-gray-200 hover:border-gray-300",
              ].join(" ")}
            >
              {/* Left: radio + label */}
              <div className="flex items-center gap-4">
                <div
                  className={[
                    "flex items-center justify-center",
                    "w-6 h-6 rounded-full border-2",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>

                <span className="text-base font-semibold text-gray-900">
                  {option.label}
                </span>
              </div>

              {/* Right: check icon */}
              {isSelected && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
