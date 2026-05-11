export type RiskLevel = "green" | "yellow" | "red";
export type MarketPosition =
  | "founder-friendly"
  | "neutral"
  | "investor-friendly";

export interface Scenario {
  condition: string;
  investor_gets: string;
  founder_gets: string;
}

export interface Example {
  title: string;
  setup: string;
  scenarios: Scenario[];
  takeaway: string;
}

export interface LegalIssue {
  type: string;
  description: string;
  recommendation: string;
}

export interface LegalCheck {
  applicable_laws: { name: string; relevance: string; url?: string }[];
  risk_level: RiskLevel;
  issues: LegalIssue[];
}

export interface Variant {
  type: string;
  market_position: MarketPosition;
  description: string;
}

export interface WarStory {
  title: string;
  situation: string;
  consequence: string;
  lesson: string;
}

export interface Clause {
  id: string;
  name: string;
  name_ko: string;
  category: "economics" | "governance" | "protective" | "exit" | "founder";
  summary: string;
  variants: Variant[];
  founder_perspective: string;
  investor_perspective: string;
  negotiation_tips: string;
  examples: Example[];
  legal_check: LegalCheck;
  common_mistakes: string[];
  war_stories?: WarStory[];
}
