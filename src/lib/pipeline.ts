import { callClaude } from "@/lib/anthropic";
import type {
  LocationChapter,
  DemographicChapter,
  MarketChapter,
  SwotChapter,
  ScoreChapter,
  PipelineStatus,
} from "@/types/memo";

export type PipelineMemoData = {
  address: string;
  overallScore: number;
  locationScore: number;
  demographicScore: number;
  marketScore: number;
  riskScore: number;
  executiveSummary: string;
  locationChapter: string;
  demographicChapter: string;
  marketChapter: string;
  swotChapter: string;
  scoreChapter: string;
};

type StepData =
  | LocationChapter
  | DemographicChapter
  | MarketChapter
  | SwotChapter
  | ScoreChapter;

export async function runPipeline(
  address: string,
  onStepComplete: (step: PipelineStatus, data: StepData) => void
): Promise<PipelineMemoData> {
  // Step 1 — Location & Property Overview
  const locationChapter = await callClaude<LocationChapter>(
    "You are a commercial real estate location analyst. Given a property address, provide a detailed location and property overview. Be specific and professional. Write in the style of an institutional investment memo. Respond ONLY in JSON with no markdown or preamble.",
    `Address: ${address}

Respond with this exact JSON shape:
{
  "propertyType": string,
  "neighborhoodDescription": string,
  "geographicContext": string,
  "nearbyLandmarks": string[],
  "transitAccess": string,
  "areaCharacteristics": string,
  "summary": string
}`
  );
  onStepComplete("location", locationChapter);

  // Step 2 — Demographic & Economic Analysis
  const demographicChapter = await callClaude<DemographicChapter>(
    "You are a demographic and economic analyst specializing in commercial real estate markets. Given the prior location analysis, provide demographic and economic insights relevant to investment decisions. Respond ONLY in JSON with no markdown or preamble.",
    `Address: ${address}

Previous analysis:
${JSON.stringify(locationChapter, null, 2)}

Respond with this exact JSON shape:
{
  "populationDensity": string,
  "incomeLevel": string,
  "employmentDrivers": string[],
  "growthTrends": string,
  "economicIndicators": string,
  "summary": string
}`
  );
  onStepComplete("demographic", demographicChapter);

  // Step 3 — Market & Competitive Landscape
  const marketChapter = await callClaude<MarketChapter>(
    "You are a commercial real estate market analyst. Given the prior location and demographic analysis, assess the competitive landscape and market conditions. Respond ONLY in JSON with no markdown or preamble.",
    `Address: ${address}

Previous analysis:
${JSON.stringify({ locationChapter, demographicChapter }, null, 2)}

Respond with this exact JSON shape:
{
  "comparableProperties": string,
  "rentalPriceRange": string,
  "salePriceRange": string,
  "vacancyTrends": string,
  "demandDrivers": string[],
  "competitivePositioning": string,
  "summary": string
}`
  );
  onStepComplete("market", marketChapter);

  // Step 4 — SWOT Analysis
  const swotChapter = await callClaude<SwotChapter>(
    "You are a risk assessment specialist for commercial real estate investments. Given all prior analysis, produce a detailed SWOT analysis. Each item must be specific to this address and backed by reasoning from prior chapters. Provide 3-4 items per category. Respond ONLY in JSON with no markdown or preamble.",
    `Address: ${address}

Previous analysis:
${JSON.stringify({ locationChapter, demographicChapter, marketChapter }, null, 2)}

Respond with this exact JSON shape:
{
  "strengths": [{ "title": string, "description": string }],
  "weaknesses": [{ "title": string, "description": string }],
  "opportunities": [{ "title": string, "description": string }],
  "threats": [{ "title": string, "description": string }]
}`
  );
  onStepComplete("swot", swotChapter);

  // Step 5 — Investment Score & Summary
  const scoreChapter = await callClaude<ScoreChapter>(
    "You are a senior investment analyst producing a final assessment. Given all prior analysis chapters, generate an overall investment score and executive summary. Be decisive in your scoring. Each sub-score is out of 25, overall score is out of 100. Respond ONLY in JSON with no markdown or preamble.",
    `Address: ${address}

Previous analysis:
${JSON.stringify({ locationChapter, demographicChapter, marketChapter, swotChapter }, null, 2)}

Respond with this exact JSON shape:
{
  "overallScore": number (0-100),
  "locationScore": number (0-25),
  "demographicScore": number (0-25),
  "marketScore": number (0-25),
  "riskScore": number (0-25),
  "executiveSummary": string,
  "keyTakeaways": string[],
  "recommendation": string
}`
  );
  onStepComplete("score", scoreChapter);

  const memoData: PipelineMemoData = {
    address,
    overallScore: scoreChapter.overallScore,
    locationScore: scoreChapter.locationScore,
    demographicScore: scoreChapter.demographicScore,
    marketScore: scoreChapter.marketScore,
    riskScore: scoreChapter.riskScore,
    executiveSummary: scoreChapter.executiveSummary,
    locationChapter: JSON.stringify(locationChapter),
    demographicChapter: JSON.stringify(demographicChapter),
    marketChapter: JSON.stringify(marketChapter),
    swotChapter: JSON.stringify(swotChapter),
    scoreChapter: JSON.stringify(scoreChapter),
  };

  return memoData;
}
