function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings:
          "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

type Props = {
  expanded: boolean;
  onToggleExpanded: () => void;
};

export default function FilterRowCollapsed({
  expanded,
  onToggleExpanded,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggleExpanded}
        className={[
          "h-11 px-4 rounded-lg border text-sm font-medium flex items-center gap-1.5",
          "cursor-pointer",
          expanded
            ? "border-primary text-primary bg-primary/5"
            : "border-gray-200 text-gray-700 hover:border-gray-300",
          "transition-colors",
        ].join(" ")}
        aria-expanded={expanded}
      >
        <MaterialIcon
          name={expanded ? "expand_less" : "expand_more"}
          className={expanded ? "text-primary" : "text-gray-500"}
        />
        상세조건
      </button>
    </div>
  );
}
