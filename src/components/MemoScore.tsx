interface MemoScoreProps {
  overallScore: number;
  locationScore: number;
  demographicScore: number;
  marketScore: number;
  riskScore: number;
}

function scoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "#16a34a"; // green-600
  if (pct >= 60) return "#2563eb"; // blue-600
  if (pct >= 40) return "#d97706"; // amber-600
  return "#dc2626"; // red-600
}

function scoreBgColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-green-100 text-green-700";
  if (pct >= 60) return "bg-blue-100 text-blue-700";
  if (pct >= 40) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

interface GaugeProps {
  score: number;
}

function ScoreGauge({ score }: GaugeProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 120 120" className="w-36 h-36">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="26"
          fontWeight="bold"
          fill={color}
        >
          {score}
        </text>
        <text
          x="60"
          y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#9ca3af"
        >
          out of 100
        </text>
      </svg>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
        Overall Score
      </p>
    </div>
  );
}

interface SubScoreBarProps {
  label: string;
  score: number;
}

function SubScoreBar({ label, score }: SubScoreBarProps) {
  const pct = (score / 25) * 100;
  const color = scoreColor(score, 25);
  const badge = scoreBgColor(score, 25);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 font-sans">
          {label}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full font-sans ${badge}`}
        >
          {score}/25
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function MemoScore({
  overallScore,
  locationScore,
  demographicScore,
  marketScore,
  riskScore,
}: MemoScoreProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row items-center gap-8">
      <ScoreGauge score={overallScore} />
      <div className="flex-1 w-full flex flex-col gap-5">
        <SubScoreBar label="Location" score={locationScore} />
        <SubScoreBar label="Demographics" score={demographicScore} />
        <SubScoreBar label="Market" score={marketScore} />
        <SubScoreBar label="Risk Profile" score={riskScore} />
      </div>
    </div>
  );
}
