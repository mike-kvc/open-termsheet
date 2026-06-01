import { MarketRadar } from "@/components/market-radar";

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-blue-600">펀딩 실행 워크벤치</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          라이브 신호에서 이번 주 액션까지
        </h1>
        <p className="text-lg leading-relaxed text-zinc-500">
          지금 열려 있는 창업지원사업, 액셀러레이션, LP 출자 공고, 펀드 결성
          신호를 한곳에서 확인합니다. 한국벤처투자, 산업은행, 성장금융, KVCA 등
          주요 출자사업 공고를 실제 출처에서 가져오고, 회사 프로필에 맞춰
          투자자 리서치와 아웃리치 우선순위를 잡습니다.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard label="라이브 소스" value="2+" />
        <SummaryCard label="키 없이 동작" value="K-Startup" />
        <SummaryCard label="출자사업 DB" value="KVIC/KDB/KGF" />
      </section>

      <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-1 text-sm font-medium text-amber-900">
          읽는 방법
        </h2>
        <p className="text-sm leading-relaxed text-amber-800">
          지원사업은 창업자가 바로 신청 여부를 판단할 항목이고, 출자 공고는
          투자자의 신규 펀드 결성 맥락을 읽는 신호입니다. 회사 프로필을 바꾸면
          우선순위, 다음 행동, 소개 요청 초안이 함께 바뀝니다.
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
