import Link from "next/link";
import { clauses } from "@/data/clauses";

interface LawEntry {
  name: string;
  clauses: { id: string; name_ko: string }[];
}

function buildLawIndex(): LawEntry[] {
  const lawMap = new Map<string, { id: string; name_ko: string }[]>();

  for (const clause of clauses) {
    for (const law of clause.legal_check.applicable_laws) {
      const existing = lawMap.get(law.name) || [];
      if (!existing.some((c) => c.id === clause.id)) {
        existing.push({ id: clause.id, name_ko: clause.name_ko });
      }
      lawMap.set(law.name, existing);
    }
  }

  return Array.from(lawMap.entries())
    .map(([name, cls]) => ({ name, clauses: cls }))
    .sort((a, b) => b.clauses.length - a.clauses.length);
}

export default function LawsPage() {
  const lawIndex = buildLawIndex();

  const groups = [
    {
      title: "상법",
      laws: lawIndex.filter((l) => l.name.startsWith("상법")),
    },
    {
      title: "벤처투자촉진에 관한 특별법 (벤처투자법)",
      laws: lawIndex.filter((l) => l.name.includes("벤처투자")),
    },
    {
      title: "벤처기업육성에 관한 특별조치법 (벤처기업법)",
      laws: lawIndex.filter((l) => l.name.includes("벤처기업")),
    },
    {
      title: "기타 법령",
      laws: lawIndex.filter(
        (l) =>
          !l.name.startsWith("상법") &&
          !l.name.includes("벤처투자") &&
          !l.name.includes("벤처기업")
      ),
    },
  ].filter((g) => g.laws.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">법령 인덱스</h1>
        <p className="text-zinc-500">
          이 사이트에서 참조하는 모든 법령과 관련 조항을 한눈에 볼 수 있습니다.
        </p>
        <p className="text-sm text-zinc-400 mt-1">
          총 {lawIndex.length}개 법령 조문 · {clauses.length}개 투자 조항
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.title} className="mb-10">
          <h2 className="text-lg font-semibold tracking-tight mb-4 pb-2 border-b border-zinc-200">
            {group.title}
          </h2>
          <div className="space-y-3">
            {group.laws.map((law) => (
              <div
                key={law.name}
                className="border border-zinc-200 rounded-lg p-4"
              >
                <div className="font-medium text-sm text-zinc-800 mb-2">
                  {law.name}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {law.clauses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/clauses/${c.id}`}
                      className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                      {c.name_ko}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 p-4 bg-zinc-50 rounded-lg text-xs text-zinc-400">
        이 내용은 법률 자문이 아니며, 실제 투자 계약 시 반드시 전문가의 검토를
        받으시기 바랍니다.
      </div>
    </div>
  );
}
