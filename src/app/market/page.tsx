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
          펀딩 준비의 첫 화면은 공고 목록이 아니라 투자자 타겟 리스트여야 합니다.
          라이브 출자사업과 지원사업 데이터는 뒤에서 근거로 붙이고, 앞에서는
          소개 요청, 미팅 준비, 조건 검토로 바로 이어지게 만듭니다.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard label="첫 화면" value="Investor CRM" />
        <SummaryCard label="근거 데이터" value="Live LP" />
        <SummaryCard label="다음 행동" value="Intro Draft" />
      </section>

      <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-1 text-sm font-medium text-amber-900">
          제품 관점
        </h2>
        <p className="text-sm leading-relaxed text-amber-800">
          한국벤처투자, 산업은행, 성장금융 같은 출자사업은 창업자에게 직접적인
          액션이 아니라 투자자 리서치의 근거입니다. 그래서 이 화면에서는 공고를
          아래로 내리고, 투자자별 다음 행동을 위로 올립니다.
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
