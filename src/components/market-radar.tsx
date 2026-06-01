"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  LiveMarketRadarResponse,
  LiveMarketSignal,
  LiveSignalType,
} from "@/types/market";

const typeLabels: Record<LiveSignalType, string> = {
  "support-program": "지원사업",
  "fund-of-funds": "펀드/출자",
  "funding-news": "투자 뉴스",
  filing: "공시",
};

const typeColor: Record<LiveSignalType, string> = {
  "support-program": "bg-emerald-100 text-emerald-800",
  "fund-of-funds": "bg-blue-100 text-blue-800",
  "funding-news": "bg-amber-100 text-amber-800",
  filing: "bg-zinc-100 text-zinc-700",
};

const tabs: Array<LiveSignalType | "all"> = [
  "all",
  "support-program",
  "fund-of-funds",
  "funding-news",
];

const coreLpSources = [
  "한국벤처투자",
  "한국산업은행",
  "한국성장금융",
  "한국벤처캐피탈협회",
];

type StartupProfile = {
  stage: "pre-seed" | "seed" | "series-a" | "growth";
  sector: string;
  roundSize: string;
  geography: string;
  traction: string;
};

type ScoredSignal = {
  signal: LiveMarketSignal;
  score: number;
  reasons: string[];
  action: {
    label: string;
    nextStep: string;
    draft: string;
    caution: string;
  };
};

const stageLabels: Record<StartupProfile["stage"], string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  growth: "Growth",
};

const stageKeywords: Record<StartupProfile["stage"], string[]> = {
  "pre-seed": ["예비", "초기", "창업", "seed", "시드", "tips", "팁스"],
  seed: ["초기", "창업", "seed", "시드", "tips", "팁스", "액셀러레이팅"],
  "series-a": ["성장", "스케일", "글로벌", "딥테크", "series", "a"],
  growth: ["성장", "스케일", "글로벌", "세컨더리", "회수", "growth"],
};

const defaultProfile: StartupProfile = {
  stage: "seed",
  sector: "AI B2B SaaS",
  roundSize: "20억",
  geography: "한국",
  traction: "유료 고객과 초기 매출 있음",
};

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[\s,./|·]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function signalText(signal: LiveMarketSignal): string {
  return [
    signal.title,
    signal.source,
    signal.category,
    signal.summary,
    signal.relevance,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreSignal(signal: LiveMarketSignal, profile: StartupProfile): ScoredSignal {
  const text = signalText(signal);
  const reasons: string[] = [];
  let score = 0;

  if (signal.type === "fund-of-funds") {
    score += 32;
    reasons.push("신규 펀드 결성/출자 맥락을 읽을 수 있음");
  }

  if (signal.type === "support-program") {
    score += 18;
    reasons.push("창업자가 직접 신청하거나 병행할 수 있는 프로그램");
  }

  if (coreLpSources.includes(signal.source)) {
    score += 22;
    reasons.push("핵심 LP 출자사업 소스");
  }

  const profileTokens = tokenize(
    `${profile.sector} ${profile.geography} ${profile.traction}`
  );
  const matchedTokens = profileTokens.filter((token) => text.includes(token));
  if (matchedTokens.length > 0) {
    score += Math.min(30, matchedTokens.length * 10);
    reasons.push(`프로필 키워드 매칭: ${matchedTokens.slice(0, 3).join(", ")}`);
  }

  const matchedStageKeywords = stageKeywords[profile.stage].filter((keyword) =>
    text.includes(keyword)
  );
  if (matchedStageKeywords.length > 0) {
    score += Math.min(20, matchedStageKeywords.length * 7);
    reasons.push(`${stageLabels[profile.stage]} 단계 힌트 포함`);
  }

  if (profile.roundSize && signal.type === "fund-of-funds") {
    score += 10;
    reasons.push(`${profile.roundSize} 라운드 투자자 풀 확장 신호`);
  }

  const action =
    signal.type === "fund-of-funds"
      ? {
          label: "VC 타겟 리스트에 반영",
          nextStep:
            "공고 원문에서 위탁운용사 선정 결과와 펀드 목적을 확인하고, 해당 운용사의 최근 투자 단계/섹터를 투자자 카드에 기록합니다.",
          draft: `${stageLabels[profile.stage]} ${profile.sector} 라운드를 준비 중입니다. ${signal.source} 출자사업 맥락상 신규 펀드 결성 또는 위탁운용사 선정 흐름을 확인했고, 저희 라운드와의 fit을 검토하고 싶습니다. 관련 담당 파트너 또는 심사역 소개가 가능할지 여쭙습니다.`,
          caution:
            "출자 공고 자체는 VC의 실제 투자 가능성을 확정하지 않습니다. 선정 결과, 펀드 결성 완료 여부, 투자 기간을 원문으로 확인해야 합니다.",
        }
      : {
          label: "지원/병행 자금 검토",
          nextStep:
            "마감일, 지원 대상, 요구 서류를 확인하고 현재 라운드 일정과 충돌하지 않으면 신청 체크리스트에 추가합니다.",
          draft: `${profile.sector} ${stageLabels[profile.stage]} 팀입니다. 현재 ${profile.roundSize} 라운드와 병행 가능한 지원사업을 검토 중이며, ${signal.title}의 지원 대상과 제출 서류가 저희 상황에 맞는지 확인하고 싶습니다.`,
          caution:
            "지원사업은 투자자 매칭과 다르게 심사/행정 일정이 길 수 있습니다. 라운드 클로징 일정과 병행 가능성을 먼저 확인해야 합니다.",
        };

  return {
    signal,
    score,
    reasons: reasons.slice(0, 4),
    action,
  };
}

export function MarketRadar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeType, setActiveType] = useState<LiveSignalType | "all">("all");
  const [activeSource, setActiveSource] = useState<string | "all">("all");
  const [profile, setProfile] = useState<StartupProfile>(defaultProfile);
  const [data, setData] = useState<LiveMarketRadarResponse | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (submittedQuery) params.set("q", submittedQuery);
        const response = await fetch(`/api/market/radar?${params}`, {
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
  }, [submittedQuery]);

  const filteredSignals = useMemo(() => {
    const signals = data?.signals ?? [];
    return signals.filter((signal) => {
      const typeMatches = activeType === "all" || signal.type === activeType;
      const sourceMatches =
        activeSource === "all" || signal.source === activeSource;
      return typeMatches && sourceMatches;
    });
  }, [activeSource, activeType, data]);

  const sourceCounts = useMemo(() => {
    const signals = data?.signals ?? [];
    return coreLpSources
      .map((source) => ({
        source,
        count: signals.filter((signal) => signal.source === source).length,
      }))
      .filter((item) => item.count > 0);
  }, [data]);

  const counts = useMemo(() => {
    const signals = data?.signals ?? [];
    return tabs.map((tab) => ({
      key: tab,
      count:
        tab === "all"
          ? signals.length
          : signals.filter((signal) => signal.type === tab).length,
    }));
  }, [data]);

  const scoredSignals = useMemo(() => {
    const signals = data?.signals ?? [];
    return signals
      .map((signal) => scoreSignal(signal, profile))
      .sort((a, b) => b.score - a.score);
  }, [data, profile]);

  const recommendedSignals = scoredSignals.slice(0, 3);

  const savedSignals = useMemo(() => {
    const savedIds = new Set(saved);
    return scoredSignals.filter(({ signal }) => savedIds.has(signal.id));
  }, [saved, scoredSignals]);

  const scoredSignalById = useMemo(() => {
    return new Map(scoredSignals.map((item) => [item.signal.id, item]));
  }, [scoredSignals]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const toggleSaved = (signal: LiveMarketSignal) => {
    setSaved((current) =>
      current.includes(signal.id)
        ? current.filter((id) => id !== signal.id)
        : [...current, signal.id]
    );
  };

  const updateProfile = (field: keyof StartupProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <div>
      <form onSubmit={submit} className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="섹터, VC, 지역, 키워드 검색 (예: 딥테크, TIPS, 글로벌, 콘텐츠)"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm placeholder:text-zinc-300 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          검색
        </button>
      </form>

      {data && (
        <div className="mb-6 rounded-lg border border-zinc-200 p-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium">라이브 소스 상태</h2>
            <p className="text-xs text-zinc-400">
              업데이트 {formatGeneratedAt(data.generatedAt)}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {data.sources.map((source) => (
              <a
                key={source.id}
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-zinc-200 p-3 hover:border-zinc-400"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      source.status === "live"
                        ? "bg-emerald-100 text-emerald-800"
                        : source.status === "not-configured"
                          ? "bg-zinc-100 text-zinc-600"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {source.status === "live"
                      ? "live"
                      : source.status === "not-configured"
                        ? "키 필요"
                        : "오류"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {source.itemCount}개 {source.message ? `· ${source.message}` : ""}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      <section className="mb-6 rounded-lg border border-zinc-200 p-4">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-medium">회사 프로필 기반 액션</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              같은 라이브 데이터라도 회사 단계, 섹터, 라운드 규모에 따라 우선순위와
              다음 행동이 달라집니다.
            </p>
          </div>
          <div className="text-xs text-zinc-400">
            {data ? `${scoredSignals.length}개 신호 평가` : "데이터 대기 중"}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-zinc-500">
            단계
            <select
              value={profile.stage}
              onChange={(event) => updateProfile("stage", event.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              {Object.entries(stageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-zinc-500">
            섹터/키워드
            <input
              value={profile.sector}
              onChange={(event) => updateProfile("sector", event.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            목표 라운드 규모
            <input
              value={profile.roundSize}
              onChange={(event) => updateProfile("roundSize", event.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            지역/시장
            <input
              value={profile.geography}
              onChange={(event) => updateProfile("geography", event.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </label>
          <label className="text-xs font-medium text-zinc-500 sm:col-span-2">
            현재 traction
            <input
              value={profile.traction}
              onChange={(event) => updateProfile("traction", event.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </label>
        </div>
      </section>

      {recommendedSignals.length > 0 && (
        <section className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-3">
            <h2 className="text-sm font-medium text-emerald-950">
              지금 바로 할 액션
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              라이브 신호를 회사 프로필에 맞춰 점수화했습니다. 점수는 투자 가능성
              확정이 아니라, 이번 주 리서치와 아웃리치 우선순위입니다.
            </p>
          </div>
          <div className="space-y-3">
            {recommendedSignals.map(({ signal, score, reasons, action }) => (
              <article
                key={signal.id}
                className="rounded-md border border-emerald-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-700">
                      {action.label} · 우선순위 {score}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold leading-snug">
                      {signal.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">{signal.source}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaved(signal)}
                    className={`shrink-0 rounded-md border px-3 py-2 text-xs ${
                      saved.includes(signal.id)
                        ? "border-emerald-800 bg-emerald-800 text-white"
                        : "border-emerald-200 text-emerald-800 hover:border-emerald-500"
                    }`}
                  >
                    {saved.includes(signal.id) ? "실행 플랜에 있음" : "실행 플랜에 추가"}
                  </button>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-700">
                  <span className="font-medium">다음 행동: </span>
                  {action.nextStep}
                </p>
                <div className="mt-3 rounded-md bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600">
                  <div className="mb-1 font-medium text-zinc-900">
                    소개 요청/문의 초안
                  </div>
                  {action.draft}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {savedSignals.length > 0 && (
        <section className="mb-6 rounded-lg border border-zinc-200 p-4">
          <h2 className="text-sm font-medium">이번 주 실행 플랜</h2>
          <div className="mt-3 space-y-3">
            {savedSignals.map(({ signal, action }) => (
              <div
                key={signal.id}
                className="rounded-md border border-zinc-200 p-3 text-sm"
              >
                <div className="font-medium">{signal.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {action.nextStep}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {counts.map(({ key, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveType(key)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              activeType === key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
            }`}
          >
            {key === "all" ? "전체" : typeLabels[key]} ({count})
          </button>
        ))}
      </div>

      {sourceCounts.length > 0 && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-blue-900">
                메인 출자사업 펀드 DB
              </h2>
              <p className="mt-1 text-xs text-blue-800">
                한국벤처투자, 산업은행, 성장금융, KVCA 공고를 우선 필터로 봅니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSource("all")}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                activeSource === "all"
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-blue-200 bg-white text-blue-700"
              }`}
            >
              전체 출처
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sourceCounts.map(({ source, count }) => (
              <button
                key={source}
                type="button"
                onClick={() => {
                  setActiveSource(source);
                  setActiveType("fund-of-funds");
                }}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  activeSource === source
                    ? "border-blue-900 bg-blue-900 text-white"
                    : "border-blue-200 bg-white text-blue-700"
                }`}
              >
                {source} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-400">
          라이브 데이터를 불러오는 중입니다.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          라이브 데이터를 불러오지 못했습니다: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredSignals.map((signal) => {
            const isSaved = saved.includes(signal.id);
            return (
              <article
                key={signal.id}
                className="rounded-lg border border-zinc-200 p-5"
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${typeColor[signal.type]}`}
                      >
                        {typeLabels[signal.type]}
                      </span>
                      {signal.category && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                          {signal.category}
                        </span>
                      )}
                      {signal.deadlineLabel && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                          {signal.deadlineLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold leading-snug">
                      {signal.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {signal.source}
                      {signal.detectedAt ? ` · ${signal.detectedAt}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaved(signal)}
                    className={`shrink-0 rounded-md border px-3 py-2 text-xs ${
                      isSaved
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                    }`}
                  >
                    {isSaved ? "플랜에 추가됨" : "플랜에 추가"}
                  </button>
                </div>

                <p className="mb-3 text-sm leading-relaxed text-zinc-600">
                  {signal.relevance}
                </p>
                {scoredSignalById.get(signal.id) && (
                  <p className="mb-3 text-xs leading-relaxed text-zinc-500">
                    {scoredSignalById.get(signal.id)?.action.caution}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-zinc-400">{signal.summary}</p>
                  <a
                    href={signal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline decoration-blue-200 underline-offset-4 hover:text-blue-800"
                  >
                    원문 보기
                  </a>
                </div>
              </article>
            );
          })}

          {filteredSignals.length === 0 && (
            <div className="rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-400">
              조건에 맞는 라이브 신호가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
