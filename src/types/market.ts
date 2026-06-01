export type IntegrationCategory =
  | "public-programs"
  | "investor-database"
  | "filings"
  | "news-search"
  | "global-database"
  | "reference-signal"
  | "ai-discovery";

export type IntegrationModel =
  | "official-api"
  | "licensed-data"
  | "public-search-api"
  | "manual-curation"
  | "candidate-source";

export type IntegrationPriority = "now" | "next" | "later";
export type IntegrationConfidence = "high" | "medium" | "low";

export interface MarketIntegration {
  id: string;
  name: string;
  category: IntegrationCategory;
  priority: IntegrationPriority;
  integrationModel: IntegrationModel;
  confidence: IntegrationConfidence;
  sourceUrl: string;
  bestFor: string[];
  founderUseCase: string;
  dataCovered: string[];
  dynamicValue: string;
  implementationNotes: string;
  risks: string[];
}

export type LiveSignalType =
  | "support-program"
  | "fund-of-funds"
  | "funding-news"
  | "filing";

export type LiveSignalConfidence = "official" | "source" | "candidate";

export interface LiveMarketSignal {
  id: string;
  type: LiveSignalType;
  title: string;
  source: string;
  url: string;
  detectedAt?: string;
  deadlineLabel?: string;
  category?: string;
  summary: string;
  relevance: string;
  confidence: LiveSignalConfidence;
}

export interface LiveMarketSourceStatus {
  id: string;
  name: string;
  status: "live" | "not-configured" | "error";
  itemCount: number;
  message?: string;
  sourceUrl: string;
}

export interface LiveMarketRadarResponse {
  generatedAt: string;
  signals: LiveMarketSignal[];
  sources: LiveMarketSourceStatus[];
}
