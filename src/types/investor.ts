export type StartupStage = "pre-seed" | "seed" | "series-a" | "growth";

export type TargetStatus = "research" | "intro" | "meeting" | "terms";

export type InvestorKind =
  | "VC"
  | "초기투자"
  | "AC"
  | "CVC"
  | "성장투자"
  | "전략/금융";

export type VerificationLevel = "seed" | "source-candidate" | "source-backed";

export interface DirectorySource {
  id: string;
  name: string;
  bestFor: string;
  status: "live" | "identified" | "needs-license";
  url: string;
}

export interface StartupProfile {
  stage: StartupStage;
  sector: string;
  roundSize: string;
  geography: string;
  traction: string;
}

export interface InvestorEntity {
  id: string;
  name: string;
  kind: InvestorKind;
  role: "lead 후보" | "초기 리드/공동투자" | "팔로우온 후보" | "전략적 후보";
  status: TargetStatus;
  stageFit: StartupStage[];
  sectors: string[];
  route: string;
  check: string;
  termLens: string;
  verification: VerificationLevel;
  sourceIds: string[];
  lastVerifiedAt: string | null;
}

export type ScoredInvestorTarget = InvestorEntity & {
  score: number;
  reasons: string[];
  nextAction: string;
  draft: string;
};
