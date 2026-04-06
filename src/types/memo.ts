export interface MemoData {
  id: string;
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
  createdAt: Date;
}

export interface LocationChapter {
  propertyType: string;
  neighborhoodDescription: string;
  geographicContext: string;
  nearbyLandmarks: string[];
  transitAccess: string;
  areaCharacteristics: string;
  summary: string;
}

export interface DemographicChapter {
  populationDensity: string;
  incomeLevel: string;
  employmentDrivers: string[];
  growthTrends: string;
  economicIndicators: string;
  summary: string;
}

export interface MarketChapter {
  comparableProperties: string;
  rentalPriceRange: string;
  salePriceRange: string;
  vacancyTrends: string;
  demandDrivers: string[];
  competitivePositioning: string;
  summary: string;
}

export interface SwotItem {
  title: string;
  description: string;
}

export interface SwotChapter {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

export interface ScoreChapter {
  overallScore: number;
  locationScore: number;
  demographicScore: number;
  marketScore: number;
  riskScore: number;
  executiveSummary: string;
  keyTakeaways: string[];
  recommendation: string;
}

export type PipelineStatus =
  | "location"
  | "demographic"
  | "market"
  | "swot"
  | "score"
  | "complete"
  | "error";

export interface PipelineEvent {
  step: PipelineStatus;
  data?: LocationChapter | DemographicChapter | MarketChapter | SwotChapter | ScoreChapter | MemoData;
  error?: string;
}
