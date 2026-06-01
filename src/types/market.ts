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
