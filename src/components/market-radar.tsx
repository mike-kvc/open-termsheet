"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  LiveMarketRadarResponse,
  LiveMarketSignal,
  LiveSignalType,
} from "@/types/market";

type StartupStage = "pre-seed" | "seed" | "series-a" | "growth";
type TargetStatus = "research" | "intro" | "meeting" | "terms";
type WorkspaceTab = "targets" | "evidence" | "drafts";

type StartupProfile = {
  stage: StartupStage;
  sector: string;
  roundSize: string;
  geography: string;
  traction: string;
};

type InvestorTarget = {
  id: string;
  name: string;
  role: "lead 후보" | "초기 리드/공동투자" | "팔로우온 후보" | "전략적 후보";
  status: TargetStatus;
  stageFit: StartupStage[];
  sectors: string[];
  route: string;
  check: string;
  termLens: string;
};

type ScoredTarget = InvestorTarget & {
  score: number;
  reasons: string[];
  nextAction: string;
  draft: string;
};

const stageLabels: Record<StartupStage, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  growth: "Growth",
};

const statusLabels: Record<TargetStatus, string> = {
  research: "리서치",
  intro: "소개 요청",
  meeting: "미팅 준비",
  terms: "조건 검토",
};

const typeLabels: Record<LiveSignalType, string> = {
  "support-program": "지원사업",
  "fund-of-funds": "출자/펀드",
  "funding-news": "뉴스",
  filing: "공시",
};

const coreLpSources = [
  "한국벤처투자",
  "한국산업은행",
  "한국성장금융",
  "한국벤처캐피탈협회",
];

const defaultProfile: StartupProfile = {
  stage: "seed",
  sector: "AI B2B SaaS",
  roundSize: "20억",
  geography: "한국",
  traction: "유료 고객과 초기 매출 있음",
};

const seedTargets: InvestorTarget[] = [
  {
    id: "kakao-ventures",
    name: "Kakao Ventures",
    role: "초기 리드/공동투자",
    status: "intro",
    stageFit: ["pre-seed", "seed", "series-a"],
    sectors: ["ai", "b2b", "saas", "consumer", "mobile", "software"],
    route: "포트폴리오 창업자 또는 공동투자 VC 경유 소개 요청",
    check: "최근 동일 섹터 투자와 담당 파트너를 확인",
    termLens: "초기 투자자라 후속 라운드 권리와 pro-rata 조항을 먼저 점검",
  },
  {
    id: "bonangels",
    name: "BonAngels",
    role: "초기 리드/공동투자",
    status: "intro",
    stageFit: ["pre-seed", "seed"],
    sectors: ["ai", "b2b", "saas", "consumer", "marketplace", "software"],
    route: "창업자 네트워크, 엔젤 투자자, 기존 포트폴리오 경유",
    check: "팀/제품 검증 단계에서 설득 가능한 traction narrative 준비",
    termLens: "초기 라운드 valuation cap, 우선주 조건, 동반투자 구조 확인",
  },
  {
    id: "futureplay",
    name: "FuturePlay",
    role: "초기 리드/공동투자",
    status: "research",
    stageFit: ["pre-seed", "seed", "series-a"],
    sectors: ["ai", "deeptech", "robotics", "healthcare", "software"],
    route: "기술 자문자, accelerator 네트워크, 포트폴리오 경유",
    check: "기술 차별성과 초기 고객 검증 자료를 한 장으로 정리",
    termLens: "기술/IP 관련 진술보장과 후속 사업협력 기대치를 분리",
  },
  {
    id: "bass-investment",
    name: "Bass Investment",
    role: "lead 후보",
    status: "meeting",
    stageFit: ["seed", "series-a"],
    sectors: ["ai", "b2b", "saas", "commerce", "software"],
    route: "공동투자 VC, founder referral, 기존 고객/파트너 경유",
    check: "매출 성장률, retention, sales pipeline 근거를 먼저 확인",
    termLens: "리드 투자 조건, board seat, follow-on reserve 확인",
  },
  {
    id: "dsc-investment",
    name: "DSC Investment",
    role: "lead 후보",
    status: "research",
    stageFit: ["seed", "series-a", "growth"],
    sectors: ["ai", "deeptech", "bio", "software", "platform"],
    route: "산업 전문가, 공동투자 VC, 심사역 직접 접점 탐색",
    check: "라운드 규모와 리드 가능성, 펀드별 투자 단계 확인",
    termLens: "보호조항, 이사회 구성, 후속투자 권리를 집중 검토",
  },
  {
    id: "korea-investment-partners",
    name: "Korea Investment Partners",
    role: "팔로우온 후보",
    status: "research",
    stageFit: ["series-a", "growth"],
    sectors: ["ai", "software", "bio", "global", "platform"],
    route: "기존 투자자 소개, 성장 라운드 공동투자자 경유",
    check: "Series A 이후 지표와 글로벌 확장 스토리 필요",
    termLens: "대형 라운드에서 liquidation preference와 veto scope 확인",
  },
];

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[\s,./|·()]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function isCoreLpSignal(signal: LiveMarketSignal): boolean {
  return coreLpSources.includes(signal.source) || signal.type === "fund-of-funds";
}

function scoreTarget(
  target: InvestorTarget,
  profile: StartupProfile,
  signals: LiveMarketSignal[]
): ScoredTarget {
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

export function MarketRadar() {
  const [profile, setProfile] = useState<StartupProfile>(defaultProfile);
  const [data, setData] = useState<LiveMarketRadarResponse | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState(seedTargets[0].id);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("targets");
  const [savedTargetIds, setSavedTargetIds] = useState<string[]>([
    seedTargets[0].id,
    seedTargets[3].id,
  ]);
  const [evidenceFilter, setEvidenceFilter] = useState<LiveSignalType | "all">(
    "fund-of-funds"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/market/radar", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setData((await response.json()) as LiveMarketRadarResponse);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "로드 실패");
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const signals = useMemo(() => data?.signals ?? [], [data]);

  const scoredTargets = useMemo(() => {
    return seedTargets
      .map((target) => scoreTarget(target, profile, signals))
      .sort((a, b) => b.score - a.score);
  }, [profile, signals]);

  const selectedTarget =
    scoredTargets.find((target) => target.id === selectedTargetId) ??
    scoredTargets[0];

  const savedTargets = scoredTargets.filter((target) =>
    savedTargetIds.includes(target.id)
  );

  const evidenceSignals = signals
    .filter((signal) =>
      evidenceFilter === "all" ? true : signal.type === evidenceFilter
    )
    .slice(0, 12);

  const liveLpSignals = signals.filter(isCoreLpSignal);
  const updateProfile = (field: keyof StartupProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const toggleSavedTarget = (targetId: string) => {
    setSavedTargetIds((current) =>
      current.includes(targetId)
        ? current.filter((id) => id !== targetId)
        : [...current, targetId]
    );
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">내 라운드</h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                투자자 리스트를 먼저 만들고, 라이브 데이터는 근거로 붙입니다.
              </p>
            </div>
            {data && (
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                live {signals.length}
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-zinc-500">
              단계
              <select
                value={profile.stage}
                onChange={(event) => updateProfile("stage", event.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
              >
                {Object.entries(stageLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-zinc-500">
              섹터
              <input
                value={profile.sector}
                onChange={(event) => updateProfile("sector", event.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />
            </label>
            <label className="text-xs font-medium text-zinc-500">
              라운드 규모
              <input
                value={profile.roundSize}
                onChange={(event) =>
                  updateProfile("roundSize", event.target.value)
                }
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />
            </label>
            <label className="text-xs font-medium text-zinc-500">
              지역/시장
              <input
                value={profile.geography}
                onChange={(event) =>
                  updateProfile("geography", event.target.value)
                }
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />
            </label>
            <label className="text-xs font-medium text-zinc-500 sm:col-span-2">
              traction
              <input
                value={profile.traction}
                onChange={(event) =>
                  updateProfile("traction", event.target.value)
                }
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-4">
          <h2 className="text-sm font-semibold">이번 주 펀딩 큐</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric label="타겟" value={`${scoredTargets.length}`} />
            <Metric label="저장" value={`${savedTargets.length}`} />
            <Metric label="근거" value={`${liveLpSignals.length}`} />
          </div>
          <div className="mt-4 space-y-2">
            {savedTargets.slice(0, 3).map((target) => (
              <button
                key={target.id}
                type="button"
                onClick={() => {
                  setSelectedTargetId(target.id);
                  setActiveTab("drafts");
                }}
                className="w-full rounded-md border border-zinc-200 p-3 text-left hover:border-zinc-400"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{target.name}</span>
                  <span className="text-xs text-zinc-400">{target.score}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{target.nextAction}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {data && (
        <section className="rounded-lg border border-zinc-200 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">데이터 상태</h2>
              <p className="mt-1 text-xs text-zinc-500">
                업데이트 {formatGeneratedAt(data.generatedAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:border-zinc-400"
                >
                  {source.name} · {source.status} · {source.itemCount}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        {[
          ["targets", "투자자 타겟"],
          ["evidence", "근거 inbox"],
          ["drafts", "아웃리치/조건"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key as WorkspaceTab)}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeTab === key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "targets" && (
        <section className="grid gap-4 lg:grid-cols-2">
          {scoredTargets.map((target) => (
            <article
              key={target.id}
              className={`rounded-lg border p-4 ${
                selectedTarget.id === target.id
                  ? "border-zinc-900"
                  : "border-zinc-200"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-blue-600">
                    {target.role} · {statusLabels[target.status]}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{target.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">{target.score}</div>
                  <div className="text-xs text-zinc-400">match</div>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {target.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600"
                  >
                    {reason}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-zinc-600">
                {target.nextAction}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetId(target.id);
                    setActiveTab("drafts");
                  }}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
                >
                  소개 요청 초안
                </button>
                <button
                  type="button"
                  onClick={() => toggleSavedTarget(target.id)}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-xs text-zinc-600 hover:border-zinc-400"
                >
                  {savedTargetIds.includes(target.id) ? "큐에서 제거" : "큐에 추가"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === "evidence" && (
        <section className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">근거 inbox</h2>
              <p className="mt-1 text-xs text-zinc-500">
                이 데이터는 투자자 카드의 판단 근거입니다. 원문 확인 전에는 확정
                사실로 쓰지 않습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["fund-of-funds", "support-program", "all"] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setEvidenceFilter(filter)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      evidenceFilter === filter
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-600"
                    }`}
                  >
                    {filter === "all" ? "전체" : typeLabels[filter]}
                  </button>
                )
              )}
            </div>
          </div>

          {isLoading && (
            <div className="rounded-md border border-zinc-200 p-8 text-center text-sm text-zinc-400">
              라이브 데이터를 불러오는 중입니다.
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              라이브 데이터를 불러오지 못했습니다: {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-3">
              {evidenceSignals.map((signal) => (
                <article
                  key={signal.id}
                  className="rounded-md border border-zinc-200 p-4"
                >
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                      {typeLabels[signal.type]}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                      {signal.source}
                    </span>
                    {signal.deadlineLabel && (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                        {signal.deadlineLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">
                    {signal.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {signal.relevance}
                  </p>
                  <a
                    href={signal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm text-blue-600 underline decoration-blue-200 underline-offset-4"
                  >
                    원문 확인
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "drafts" && selectedTarget && (
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-zinc-200 p-4">
            <p className="text-xs font-medium text-blue-600">
              {selectedTarget.role}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{selectedTarget.name}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <InfoRow label="소개 경로" value={selectedTarget.route} />
              <InfoRow label="미팅 체크" value={selectedTarget.check} />
              <InfoRow label="조건 관점" value={selectedTarget.termLens} />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4">
            <h2 className="text-sm font-semibold">바로 보낼 초안</h2>
            <div className="mt-3 rounded-md bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
              {selectedTarget.draft}
            </div>
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              이 초안은 소개 요청용 시작점입니다. 보내기 전에 실제 담당자, 최근
              투자, 펀드 상태, 이해상충 가능성을 확인해야 합니다.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-50 p-3">
      <div className="text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-zinc-400">{label}</div>
      <div className="mt-1 text-zinc-700">{value}</div>
    </div>
  );
}
