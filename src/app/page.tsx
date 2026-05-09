import { clauses, categories } from "@/data/clauses";
import { ClauseList } from "@/components/clause-list";

export default function Home() {
  const categoryKeys = Object.keys(categories);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          투자 텀시트, 양쪽에서 읽기
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed">
          스타트업 투자 계약의 주요 조항을 창업자와 투자자 양쪽 관점에서
          해석합니다. 사례 기반의 쉬운 설명과 한국 법률 검토를 포함합니다.
        </p>
      </section>

      <ClauseList clauses={clauses} categories={categoryKeys} />
    </div>
  );
}
