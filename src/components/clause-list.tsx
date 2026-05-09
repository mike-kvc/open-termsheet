"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Clause } from "@/types/clause";

const positionLabel = {
  "founder-friendly": "창업자 유리",
  neutral: "중립",
  "investor-friendly": "투자자 유리",
} as const;

const positionColor = {
  "founder-friendly": "bg-emerald-100 text-emerald-800",
  neutral: "bg-zinc-100 text-zinc-600",
  "investor-friendly": "bg-amber-100 text-amber-800",
} as const;

const categoryLabels: Record<string, string> = {
  economics: "경제적 조건",
  governance: "지배구조",
  protective: "투자자 보호",
  exit: "Exit 관련",
  founder: "창업자 관련",
};

function matchesSearch(clause: Clause, query: string): boolean {
  const q = query.toLowerCase();
  if (clause.name.toLowerCase().includes(q)) return true;
  if (clause.name_ko.includes(q)) return true;
  if (clause.summary.includes(q)) return true;
  for (const law of clause.legal_check.applicable_laws) {
    if (law.name.includes(q)) return true;
    if (law.relevance.includes(q)) return true;
  }
  return false;
}

export function ClauseList({
  clauses,
  categories,
}: {
  clauses: Clause[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = clauses;
    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter((c) => matchesSearch(c, search.trim()));
    }
    return result;
  }, [clauses, activeCategory, search]);

  const grouped = useMemo(() => {
    const cats = activeCategory ? [activeCategory] : categories;
    return cats
      .map((key) => ({
        key,
        label: categoryLabels[key] || key,
        items: filtered.filter((c) => c.category === key),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, categories, activeCategory]);

  const matchedLaws = useMemo(() => {
    if (!search.trim()) return [];
    const laws = new Map<string, string[]>();
    for (const clause of filtered) {
      for (const law of clause.legal_check.applicable_laws) {
        if (
          law.name.includes(search.trim()) ||
          law.relevance.includes(search.trim())
        ) {
          const existing = laws.get(law.name) || [];
          if (!existing.includes(clause.name_ko)) {
            existing.push(clause.name_ko);
          }
          laws.set(law.name, existing);
        }
      }
    }
    return Array.from(laws.entries());
  }, [filtered, search]);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="조항명, 법령명, 조문번호로 검색 (예: 상법 제344조, 전환권, 벤처투자법)"
          className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-300"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            activeCategory === null
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
          }`}
        >
          전체 ({clauses.length})
        </button>
        {categories.map((cat) => {
          const count = clauses.filter((c) => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {categoryLabels[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Law Matches */}
      {matchedLaws.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-700 mb-2">
            관련 법령 매칭
          </p>
          <div className="space-y-1">
            {matchedLaws.map(([law, clauseNames]) => (
              <div key={law} className="text-sm text-blue-600">
                <span className="font-medium">{law}</span>
                <span className="text-blue-400">
                  {" "}
                  — {clauseNames.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg mb-2">검색 결과가 없습니다</p>
          <p className="text-sm">다른 키워드로 검색해 보세요</p>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.key} className="mb-10">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
              {group.label}
            </h2>
            <div className="space-y-3">
              {group.items.map((clause) => (
                <Link
                  key={clause.id}
                  href={`/clauses/${clause.id}`}
                  className="block border border-zinc-200 rounded-lg p-5 hover:border-zinc-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">
                        {clause.name_ko}
                        <span className="ml-2 text-sm font-normal text-zinc-400">
                          {clause.name}
                        </span>
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {clause.summary}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {clause.variants.slice(0, 2).map((v) => (
                        <span
                          key={v.type}
                          className={`text-xs px-2 py-0.5 rounded-full ${positionColor[v.market_position]}`}
                        >
                          {positionLabel[v.market_position]}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
