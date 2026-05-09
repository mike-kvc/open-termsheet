import { notFound } from "next/navigation";
import Link from "next/link";
import { clauses, clauseMap } from "@/data/clauses";

export function generateStaticParams() {
  return clauses.map((c) => ({ id: c.id }));
}

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

const riskColor = {
  green: "bg-emerald-100 text-emerald-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
} as const;

const riskLabel = {
  green: "낮음",
  yellow: "주의",
  red: "높음",
} as const;

export default async function ClausePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clause = clauseMap[id];
  if (!clause) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {clause.name_ko}
        </h1>
        <p className="text-zinc-400 mb-4">{clause.name}</p>
        <p className="text-zinc-600 leading-relaxed">{clause.summary}</p>
      </header>

      {/* Variants */}
      <Section title="유형별 비교">
        <div className="space-y-3">
          {clause.variants.map((v) => (
            <div
              key={v.type}
              className="border border-zinc-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{v.type}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${positionColor[v.market_position]}`}
                >
                  {positionLabel[v.market_position]}
                </span>
              </div>
              <p className="text-sm text-zinc-500">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Perspectives */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="border border-zinc-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-emerald-700 mb-3">
            창업자 관점
          </h3>
          <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
            {clause.founder_perspective}
          </div>
        </div>
        <div className="border border-zinc-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-blue-700 mb-3">
            투자자 관점
          </h3>
          <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
            {clause.investor_perspective}
          </div>
        </div>
      </div>

      {/* Examples */}
      <Section title="사례로 이해하기">
        <div className="space-y-8">
          {clause.examples.map((ex) => (
            <div key={ex.title}>
              <h4 className="font-medium mb-2">{ex.title}</h4>
              <p className="text-sm text-zinc-500 mb-4 bg-zinc-50 rounded-lg p-3">
                {ex.setup}
              </p>
              <div className="space-y-2 mb-3">
                {ex.scenarios.map((s) => (
                  <div
                    key={s.condition}
                    className="border border-zinc-200 rounded-lg p-4 text-sm"
                  >
                    <div className="font-medium text-zinc-800 mb-2">
                      {s.condition}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-medium">
                          투자자
                        </span>
                        <p className="text-zinc-600 mt-1">
                          {s.investor_gets}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-emerald-600 font-medium">
                          창업자
                        </span>
                        <p className="text-zinc-600 mt-1">
                          {s.founder_gets}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                {ex.takeaway}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Negotiation Tips */}
      <Section title="협상 포인트">
        <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line bg-zinc-50 rounded-lg p-5">
          {clause.negotiation_tips}
        </div>
      </Section>

      {/* Legal Check */}
      <Section title="법률 검토">
        <div className="mb-4">
          <span
            className={`text-xs px-2 py-1 rounded-full ${riskColor[clause.legal_check.risk_level]}`}
          >
            법적 리스크: {riskLabel[clause.legal_check.risk_level]}
          </span>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-zinc-500 mb-3">
            관련 법령
          </h4>
          <div className="space-y-2">
            {clause.legal_check.applicable_laws.map((law) => (
              <div
                key={law.name}
                className="border border-zinc-200 rounded-lg p-3 text-sm"
              >
                <div className="font-medium text-zinc-800">{law.name}</div>
                <p className="text-zinc-500 mt-1">{law.relevance}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-500 mb-3">
            주요 이슈
          </h4>
          <div className="space-y-3">
            {clause.legal_check.issues.map((issue) => (
              <div
                key={issue.type}
                className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 text-sm"
              >
                <div className="font-medium text-yellow-800 mb-2">
                  {issue.type}
                </div>
                <p className="text-zinc-600 mb-2">{issue.description}</p>
                <p className="text-emerald-700 text-xs">
                  → {issue.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Common Mistakes */}
      <Section title="흔한 실수">
        <ul className="space-y-2">
          {clause.common_mistakes.map((mistake) => (
            <li
              key={mistake}
              className="text-sm text-zinc-600 pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-zinc-400"
            >
              {mistake}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold tracking-tight mb-4 pb-2 border-b border-zinc-200">
        {title}
      </h2>
      {children}
    </section>
  );
}
