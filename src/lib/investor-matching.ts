import { directorySources } from "@/data/investors";
import type { LiveMarketSignal } from "@/types/market";
import type {
  InvestorEntity,
  ScoredInvestorTarget,
  StartupProfile,
  StartupStage,
  VerificationLevel,
} from "@/types/investor";

const coreLpSources = [
  "한국벤처투자",
  "한국산업은행",
  "한국성장금융",
  "한국벤처캐피탈협회",
];

const stageLabels: Record<StartupStage, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  growth: "Growth",
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[\s,./|·()]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

export function isCoreLpSignal(signal: LiveMarketSignal): boolean {
  return coreLpSources.includes(signal.source) || signal.type === "fund-of-funds";
}

export function sourceNames(sourceIds: string[]): string {
  return sourceIds
    .map((sourceId) => directorySources.find((source) => source.id === sourceId))
    .filter(Boolean)
    .map((source) => source?.name)
    .join(", ");
}

export function verificationLabel(level: VerificationLevel): string {
  if (level === "source-backed") return "source-backed";
  if (level === "source-candidate") return "source candidate";
  return "seed";
}

export function scoreInvestorTarget(
  target: InvestorEntity,
  profile: StartupProfile,
  signals: LiveMarketSignal[]
): ScoredInvestorTarget {
  const profileTokens = tokenize(`${profile.sector} ${profile.traction}`);
  const matchedSectors = target.sectors.filter((sector) =>
    profileTokens.some((token) => sector.includes(token) || token.includes(sector))
  );
  const hasStageFit = target.stageFit.includes(profile.stage);
  const liveLpCount = signals.filter(isCoreLpSignal).length;
  const supportCount = signals.filter((signal) => signal.type === "support-program")
    .length;

  let score = 40;
  const reasons: string[] = [];

  if (hasStageFit) {
    score += 22;
    reasons.push(`${stageLabels[profile.stage]} 단계 fit`);
  }

  if (matchedSectors.length > 0) {
    score += Math.min(24, matchedSectors.length * 8);
    reasons.push(`섹터 fit: ${matchedSectors.slice(0, 3).join(", ")}`);
  }

  if (target.role === "lead 후보" && profile.roundSize) {
    score += 10;
    reasons.push(`${profile.roundSize} 라운드 리드 가능성 검토`);
  }

  if (liveLpCount > 0) {
    score += 8;
    reasons.push(`라이브 출자/펀드 신호 ${liveLpCount}건`);
  }

  if (supportCount > 0 && profile.stage !== "growth") {
    score += 4;
    reasons.push("지원사업 병행 여지 있음");
  }

  const nextAction =
    target.status === "research"
      ? `${target.name}의 최근 12개월 투자, 담당 심사역, 현재 운용 펀드를 확인하고 소개 경로를 확정합니다.`
      : target.status === "intro"
        ? `${target.route}로 이번 주 소개 요청을 보냅니다.`
        : target.status === "meeting"
          ? `${target.check}를 기준으로 첫 미팅용 5문장 pitch를 준비합니다.`
          : `${target.termLens}를 기준으로 조건표 리스크를 점검합니다.`;

  const draft = `${target.name} 소개를 부탁드리고 싶습니다. 저희는 ${profile.geography} 기반 ${profile.sector} 팀이고, 현재 ${stageLabels[profile.stage]} ${profile.roundSize} 라운드를 준비 중입니다. ${profile.traction}. ${target.name}은 ${target.role}로 fit이 있을 수 있어 보이며, 특히 ${target.check} 관점에서 대화를 열어보고 싶습니다. 소개 가능하실까요?`;

  return {
    ...target,
    score: Math.min(100, score),
    reasons: reasons.slice(0, 4),
    nextAction,
    draft,
  };
}
