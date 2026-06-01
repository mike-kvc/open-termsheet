"use client";

import { useMemo, useState } from "react";
import {
  confidenceLabels,
  integrationCategoryLabels,
  integrationModelLabels,
  marketIntegrations,
  priorityLabels,
} from "@/data/market";
import type { MarketIntegration } from "@/types/market";

const priorityOrder: MarketIntegration["priority"][] = ["now", "next", "later"];

const confidenceColor: Record<MarketIntegration["confidence"], string> = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-zinc-100 text-zinc-700",
};

function matchesQuery(item: MarketIntegration, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    item.name,
    item.founderUseCase,
    item.dynamicValue,
    item.implementationNotes,
    ...item.bestFor,
    ...item.dataCovered,
    ...item.risks,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function MarketIntegrationBrowser() {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<MarketIntegration["priority"] | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    return marketIntegrations
      .filter((item) => priority === "all" || item.priority === priority)
      .filter((item) => matchesQuery(item, query))
      .sort((a, b) => {
        const priorityDiff =
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return a.name.localeCompare(b.name);
      });
  }, [priority, query]);

  const counts = useMemo(() => {
    return priorityOrder.map((key) => ({
      key,
      count: marketIntegrations.filter((item) => item.priority === key).length,
    }));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="서비스명, 데이터, 활용 목적 검색 (예: 정부지원사업, 투자자, 공시, 뉴스)"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm placeholder:text-zinc-300 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPriority("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            priority === "all"
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
          }`}
        >
          전체 ({marketIntegrations.length})
        </button>
        {counts.map(({ key, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPriority(key)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              priority === key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
            }`}
          >
            {priorityLabels[key]} ({count})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-zinc-200 p-5"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                  {item.founderUseCase}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {priorityLabels[item.priority]}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${confidenceColor[item.confidence]}`}
                >
                  신뢰도 {confidenceLabels[item.confidence]}
                </span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {integrationCategoryLabels[item.category]}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {integrationModelLabels[item.integrationModel]}
              </span>
              {item.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-medium text-zinc-400">
                  동적 가치
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {item.dynamicValue}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-medium text-zinc-400">
                  구현 메모
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {item.implementationNotes}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-medium text-zinc-400">
                  커버 데이터
                </h3>
                <ul className="space-y-1">
                  {item.dataCovered.map((data) => (
                    <li key={data} className="text-sm text-zinc-600">
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-medium text-zinc-400">
                  주의점
                </h3>
                <ul className="space-y-1">
                  {item.risks.map((risk) => (
                    <li key={risk} className="text-sm text-zinc-600">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-blue-600 underline decoration-blue-200 underline-offset-4 hover:text-blue-800"
            >
              출처 확인
            </a>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-400">
          조건에 맞는 연동 후보가 없습니다.
        </div>
      )}
    </div>
  );
}
