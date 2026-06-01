import { MarketRadar } from "@/components/market-radar";

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-blue-600">
          Fundraising CRM
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          누구에게 연락할지 먼저 정합니다
        </h1>
        <p className="text-lg leading-relaxed text-zinc-500">
          펀딩 준비의 첫 화면은 공고 목록이 아니라 source-backed 한국 투자자
          디렉토리와 타겟 리스트여야 합니다. VC, 초기투자사, AC, CVC, 성장투자자를
          찾고, KVCA·K-Startup·TIPS·PE/VC/LP 같은 원천 데이터를 근거로 붙입니다.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard label="첫 화면" value="Investor CRM" />
        <SummaryCard label="근거 데이터" value="Source DB" />
        <SummaryCard label="검색 범위" value="VC/AC/CVC" />
      </section>

      <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-1 text-sm font-medium text-amber-900">
          제품 관점
        </h2>
        <p className="text-sm leading-relaxed text-amber-800">
          한국벤처투자, 산업은행, 성장금융 같은 출자사업은 창업자에게 직접적인
          액션이 아니라 투자자 리서치의 근거입니다. 그래서 투자자 카드는 항상
          어떤 원천으로 검증할지 함께 보여줘야 합니다.
        </p>
      </section>

      <MarketRadar />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}
