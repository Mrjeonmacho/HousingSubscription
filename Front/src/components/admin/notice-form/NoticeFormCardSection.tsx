export default function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] bg-white p-6 border border-gray-200">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-9 w-1 rounded-full bg-primary/70" />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
