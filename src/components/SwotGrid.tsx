import type { SwotChapter, SwotItem } from "@/types/memo";

interface SwotGridProps {
  swot: SwotChapter;
}

interface QuadrantProps {
  title: string;
  items: SwotItem[];
  bgColor: string;
  titleColor: string;
}

function Quadrant({ title, items, bgColor, titleColor }: QuadrantProps) {
  return (
    <div className={`${bgColor} rounded-lg p-5`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${titleColor} mb-3 font-sans`}>
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i}>
            <p className="font-semibold text-gray-800 text-sm font-serif">
              {item.title}
            </p>
            <p className="text-gray-600 text-sm font-serif leading-relaxed mt-0.5">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SwotGrid({ swot }: SwotGridProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-navy font-sans uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
        SWOT Analysis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Quadrant
          title="Strengths"
          items={swot.strengths}
          bgColor="bg-green-50"
          titleColor="text-green-700"
        />
        <Quadrant
          title="Weaknesses"
          items={swot.weaknesses}
          bgColor="bg-yellow-50"
          titleColor="text-yellow-700"
        />
        <Quadrant
          title="Opportunities"
          items={swot.opportunities}
          bgColor="bg-blue-50"
          titleColor="text-blue-700"
        />
        <Quadrant
          title="Threats"
          items={swot.threats}
          bgColor="bg-red-50"
          titleColor="text-red-700"
        />
      </div>
    </section>
  );
}
