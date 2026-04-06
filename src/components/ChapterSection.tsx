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
    <section className="mb-8">
      <h2 className="text-lg font-bold text-navy font-sans uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 font-sans">
              {toLabel(key)}
            </p>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside font-serif text-gray-800 text-base leading-relaxed space-y-1">
                {value.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="font-serif text-gray-800 text-base leading-relaxed">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
