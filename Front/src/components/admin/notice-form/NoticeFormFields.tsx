export function TextField({
  label,
  required,
  value,
  placeholder,
  error,
  helper,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">{label}</span>
        {required && <span className="text-sm font-bold text-primary">*</span>}
      </div>
      {helper && !error && <p className="mb-2 mt-2 text-xs text-gray-400">{helper}</p>}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-colors",
          error
            ? "border-red-200 focus:border-red-300"
            : "border-gray-200 focus:border-gray-300",
        ].join(" ")}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  required,
  value,
  options,
  error,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">{label}</span>
        {required && <span className="text-sm font-bold text-primary">*</span>}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-colors bg-white",
          error
            ? "border-red-200 focus:border-red-300"
            : "border-gray-200 focus:border-gray-300",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function DateField({
  label,
  required,
  value,
  error,
  helper,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  error?: string;
  helper?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">{label}</span>
        {required && <span className="text-sm font-bold text-primary">*</span>}
      </div>
      {helper && !error && <p className="mb-2 mt-2 text-xs text-gray-400">{helper}</p>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-12 w-full rounded-2xl border px-4 text-sm outline-none transition-colors bg-white",
          error
            ? "border-red-200 focus:border-red-300"
            : "border-gray-200 focus:border-gray-300",
        ].join(" ")}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}
