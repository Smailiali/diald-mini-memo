import type { SwotChapter, SwotItem } from "@/types/memo";

interface SwotGridProps {
  swot: SwotChapter;
}

interface QuadrantProps {
  title: string;
  items: SwotItem[];
  headerColor: string;
}

function Quadrant({ title, items, headerColor }: QuadrantProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className={`${headerColor} px-4 py-3`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
          {title}
        </h3>
      </div>
      <div className="p-4 bg-white">
        <ul className="flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={i} className="last:mb-0 mb-3">
              <p className="text-sm font-bold text-gray-800 font-sans">
                {item.title}
              </p>
              <p className="text-sm text-gray-600 font-serif leading-relaxed mt-0.5">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SwotGrid({ swot }: SwotGridProps) {
  return (
    <section className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="w-1 h-5 bg-accent-blue rounded-full flex-shrink-0" />
        <h2 className="text-base font-bold text-navy font-sans uppercase tracking-wide">
          SWOT Analysis
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Quadrant
          title="Strengths"
          items={swot.strengths}
          headerColor="bg-green-500"
        />
        <Quadrant
          title="Weaknesses"
          items={swot.weaknesses}
          headerColor="bg-amber-500"
        />
        <Quadrant
          title="Opportunities"
          items={swot.opportunities}
          headerColor="bg-blue-500"
        />
        <Quadrant
          title="Threats"
          items={swot.threats}
          headerColor="bg-red-500"
        />
      </div>
    </section>
  );
}
