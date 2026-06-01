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

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MarketRadar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeType, setActiveType] = useState<LiveSignalType | "all">("all");
  const [activeSource, setActiveSource] = useState<string | "all">("all");
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
