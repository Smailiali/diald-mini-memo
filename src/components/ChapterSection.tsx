function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

interface ChapterSectionProps {
  title: string;
  data: Record<string, string | string[]>;
}

export default function ChapterSection({ title, data }: ChapterSectionProps) {
  return (
    <section className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="w-1 h-5 bg-accent-blue rounded-full flex-shrink-0" />
        <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 font-sans">
              {toLabel(key)}
            </p>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside font-serif text-gray-700 text-base leading-relaxed space-y-1">
                {value.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="font-serif text-gray-700 text-base leading-relaxed">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
