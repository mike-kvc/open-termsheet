import { MarketIntegrationBrowser } from "@/components/market-integration-browser";
import { marketIntegrations } from "@/data/market";

export default function MarketPage() {
  const nowCount = marketIntegrations.filter(
    (item) => item.priority === "now"
  ).length;
  const licensedCount = marketIntegrations.filter(
    (item) => item.integrationModel === "licensed-data"
  ).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-blue-600">
          Funding OS
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          시장 레퍼런스와 동적 연동 후보
        </h1>
        <p className="text-lg leading-relaxed text-zinc-500">
          스타트업이 펀딩을 시작할 때 필요한 투자자, 펀드, 정부지원사업,
          공시, 뉴스 신호를 한곳에서 확인할 수 있도록 연결 후보를 정리합니다.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard label="연동 후보" value={marketIntegrations.length} />
        <SummaryCard label="1차 우선순위" value={nowCount} />
        <SummaryCard label="계약/제휴 필요" value={licensedCount} />
      </section>

      <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-1 text-sm font-medium text-amber-900">
          제품 원칙
        </h2>
        <p className="text-sm leading-relaxed text-amber-800">
          이 데이터는 투자자 추천이나 법률 자문이 아니라 공개 출처 기반의
          의사결정 참고자료입니다. 모든 항목은 출처, 수집일, 검증상태, 신뢰도를
          함께 저장하는 구조로 확장해야 합니다.
        </p>
      </section>

      <MarketIntegrationBrowser />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}
