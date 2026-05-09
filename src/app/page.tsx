import Link from "next/link";
import { clauses, categories } from "@/data/clauses";

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

export default function Home() {
  const grouped = Object.entries(categories)
    .map(([key, label]) => ({
      key,
      label,
      items: clauses.filter((c) => c.category === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          투자 텀시트, 양쪽에서 읽기
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed">
          스타트업 투자 계약의 주요 조항을 창업자와 투자자 양쪽 관점에서
          해석합니다. 사례 기반의 쉬운 설명과 한국 법률 검토를 포함합니다.
        </p>
      </section>

      {grouped.map((group) => (
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
      ))}
    </div>
  );
}
