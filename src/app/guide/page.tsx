import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      <header className="mb-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          텀시트 검토 가이드
        </h1>
        <p className="text-zinc-500">
          투자 텀시트를 처음 받았을 때 어떻게 접근해야 하는지, 무엇을 먼저
          확인해야 하는지에 대한 프레임워크입니다.
        </p>
      </header>

      {/* 멘탈 모델 */}
      <Section title="1. 텀시트를 보는 멘탈 모델">
        <p className="text-sm text-zinc-600 leading-relaxed mb-4">
          텀시트의 모든 조항은 결국 하나의 질문에서 출발합니다:{" "}
          <strong>&quot;일이 잘못되면 어떻게 되는가?&quot;</strong>
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          투자 계약은 모든 것이 잘 될 때를 위한 문서가 아닙니다. 회사가
          성공하면 모두가 행복합니다. 계약서가 중요해지는 순간은 다운라운드,
          창업자 이탈, M&amp;A, 경영 분쟁이 발생할 때입니다. 각 조항이 이런
          &apos;최악의 시나리오&apos;에서 누구를 어떻게 보호하는지를 이해하면
          텀시트 전체가 읽힙니다.
        </p>

        <div className="grid gap-3 mb-6">
          <FrameCard
            number="1"
            title="경제적 조건 (Economics)"
            description="돈에 관한 것. 투자금, 밸류에이션, 지분율, exit 시 분배 순서."
            question="exit할 때 누가 얼마를 가져가는가?"
            clauses={[
              "잔여재산분배우선권",
              "희석방지권",
              "전환권",
              "상환권",
              "선행조건",
            ]}
          />
          <FrameCard
            number="2"
            title="지배구조 (Governance)"
            description="의사결정에 관한 것. 누가 무엇을 결정할 수 있고, 누구의 동의가 필요한가."
            question="창업자가 마음대로 할 수 없는 것은 무엇인가?"
            clauses={[
              "사전동의권",
              "이사 지명권",
              "주식처분제한",
              "경업금지",
            ]}
          />
          <FrameCard
            number="3"
            title="투자자 보호 (Protection)"
            description="리스크 관리에 관한 것. 문제가 생겼을 때 투자자가 쓸 수 있는 무기."
            question="계약이 위반되면 투자자는 어떤 구제수단이 있는가?"
            clauses={["풋옵션", "우선매수권", "진술 및 보장"]}
          />
          <FrameCard
            number="4"
            title="Exit (회수)"
            description="나가는 것에 관한 것. 언제, 어떻게, 누구와 함께 exit할 수 있는가."
            question="내가 원할 때 나갈 수 있는가? 강제로 나가야 하는 경우는?"
            clauses={[
              "동반매각요구권",
              "동반매도청구권",
              "간주청산",
            ]}
          />
        </div>
      </Section>

      {/* 검토 순서 */}
      <Section title="2. 텀시트 검토 순서">
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          텀시트를 받으면 다음 순서로 검토하세요. 위에서 아래로 갈수록 중요도가
          아니라, 의존관계 순서입니다 — 앞의 조건이 뒤의 조건에 영향을 미칩니다.
        </p>

        <div className="space-y-4">
          <StepCard
            step={1}
            title="밸류에이션과 투자 구조"
            items={[
              "Pre-money vs Post-money 명확한지 확인 — 이것만 틀려도 지분율이 크게 달라짐",
              "투자 주식의 종류 (RCPS가 표준) 및 주당 발행가",
              "Fully diluted 기준으로 Cap Table 작성 — 스톡옵션 풀 포함",
            ]}
          />
          <StepCard
            step={2}
            title="경제적 조건"
            items={[
              "Liquidation Preference: 배수(1x)와 participating 여부 — 이 두 가지가 exit 시 분배를 결정",
              "Anti-dilution: 가중평균인지 full ratchet인지 — 다운라운드 시 창업자 희석 정도",
              "상환권: 이율, 행사 시점(보통 3년 후), 배당가능이익 제한 인지",
              "배당: 참가적/비참가적, 누적적/비누적적",
            ]}
          />
          <StepCard
            step={3}
            title="지배구조와 투자자 보호"
            items={[
              "사전동의 항목 범위 — 14개가 표준, 과도하게 넓지 않은지",
              "이사 지명권 — 이사 수 변경도 사전동의 대상인지",
              "보고의무 — 월간/분기/연간 제출 일정과 형식",
              "경업금지/전업의무 — 범위(업종, 지역, 기간)가 합리적인지",
            ]}
          />
          <StepCard
            step={4}
            title="주식 처분과 Exit"
            items={[
              "Lock-up: '담보제공'까지 포함되는지 확인",
              "ROFR → Tag-Along 순차적 절차가 명확한지",
              "Drag-Along: 있다면 최소 매각가격(floor price) 조건 확인",
              "Deemed Liquidation: 경영권 이전 정의가 분할 매수를 포괄하는지",
            ]}
          />
          <StepCard
            step={5}
            title="보호 장치와 구제수단"
            items={[
              "R&W: 11개 카테고리 중 핵심은 IP 소유권, 재무상태, 기존 계약",
              "선행조건(CP): 5가지 CP 모두 포함되는지, 정관변경이 CP에 있는지",
              "Put Option: 발동 사유, 이율(연복리 10~15%), 주요주주 개인 연대 청구 여부",
              "손해배상: Cap/Basket 유무, R&W 존속기간",
            ]}
          />
        </div>
      </Section>

      {/* 법적 프레임워크 */}
      <Section title="3. 알아야 할 법적 프레임워크">
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          한국 벤처투자 계약은 여러 법률의 교차점에 있습니다. 각 법률이 어떤
          역할을 하는지 이해하면 조항의 배경이 보입니다.
        </p>

        <div className="space-y-4">
          <LawCard
            title="상법"
            url="https://www.law.go.kr/법령/상법"
            role="투자 계약의 기본 골격"
            keyPoints={[
              "제344조 (종류주식) — RCPS 발행의 법적 근거. 우선주의 권리는 정관에 규정해야 효력 발생",
              "제335조 (주식양도) — 주식 양도의 자유가 원칙. 계약상 Lock-up만으로는 양도 무효 주장 어려움 → 정관에 양도제한 병행 필요",
              "제345조 (주식상환) — 상환은 배당가능이익 범위 내에서만 가능. 초기 스타트업은 대부분 배당가능이익 없음",
              "제346조 (전환주식) — 전환 조건은 정관 기재 사항. Anti-dilution 공식도 정관에 반영해야 안전",
              "제382조 (이사 선임) — 투자자 지명권은 '추천권'이고 최종 선임은 주총",
              "제397조 (경업금지) — 이사의 경업금지. VC 파트너가 경쟁 포트폴리오 이사 겸직 시 저촉",
            ]}
            impact="정관에 반영되지 않은 우선주 권리는 법적 효력이 없습니다. SHA(주주간계약)만으로는 제3자에 대항 불가."
          />
          <LawCard
            title="벤처투자촉진에 관한 특별법 (벤처투자법)"
            url="https://www.law.go.kr/법령/벤처투자촉진에관한특별법"
            role="VC 펀드(벤처투자조합)의 투자 활동 규율"
            keyPoints={[
              "제2조 (정의) — 벤처투자, 벤처투자조합, 중소기업창업투자회사 등 정의",
              "제37조 (조합 업무) — 조합의 투자 활동 범위와 GP의 권한. 사전동의권 행사의 근거",
              "제41조 (분배) — 조합원(LP)에 대한 수익 분배 규정. Liquidation preference의 법적 배경",
              "제50조 (투자 방법) — 주식, 전환사채, 조건부지분인수계약 등 허용되는 투자 방식",
              "제51조 (조건 공시) — 투자 조건 변경(Anti-dilution 적용 등) 시 공시 의무",
              "제69조 (조합 해산) — 펀드 존속기간 만료 시 투자금 회수. 상환권/Put Option과 연결",
            ]}
            impact="모태펀드(KVIC) 출자를 받은 VC는 이 법의 적용을 받으며, full ratchet 지양 등 가이드라인이 시장 표준에 영향."
          />
          <LawCard
            title="벤처기업육성에 관한 특별조치법 (벤처기업법)"
            url="https://www.law.go.kr/법령/벤처기업육성에관한특별조치법"
            role="벤처기업 확인 요건 및 스톡옵션 특례"
            keyPoints={[
              "제16조의3 (스톡옵션 특례) — 벤처기업은 발행주식총수의 50%까지 스톡옵션 부여 가능 (상법은 10%)",
              "벤처기업 확인 — 벤처투자 유형, 기술평가 유형 등. VC 투자를 받으면 벤처기업 확인이 용이",
            ]}
            impact="스톡옵션 풀 설계 시 벤처기업 확인 여부에 따라 한도가 5배 차이. 확인 갱신 관리 필요."
          />
          <LawCard
            title="자본시장과 금융투자업에 관한 법률 (자본시장법)"
            url="https://www.law.go.kr/법령/자본시장과금융투자업에관한법률"
            role="IPO 심사 및 상장 관련 규정"
            keyPoints={[
              "IPO 시 과도한 anti-dilution(full ratchet)은 상장 심사에서 이슈",
              "K-IFRS 적용 시 RCPS의 상환권이 금융부채로 분류 → IPO 전 상환권 포기 필요",
              "보호예수(lock-up) 기간 규정 — IPO 후 6개월~1년 매도 제한",
            ]}
            impact="IPO를 목표로 한다면 계약 설계 단계부터 상장 심사 요건을 고려해야 합니다."
          />
          <LawCard
            title="민법"
            url="https://www.law.go.kr/법령/민법"
            role="계약의 일반 원칙"
            keyPoints={[
              "신의성실의 원칙 — Sandbagging(DD에서 알고도 사후 클레임)에 대한 해석 기준",
              "하자담보책임 — R&W 위반 시 구제수단의 민법적 근거",
              "불가항력 — 팬데믹 이후 중요성 재조명",
            ]}
            impact="한국 법원은 명시적 sandbagging 조항이 없으면 anti-sandbagging(신의칙)으로 해석할 가능성이 높습니다."
          />
          <LawCard
            title="소득세법 / 세법"
            url="https://www.law.go.kr/법령/소득세법"
            role="스톡옵션, 베스팅, 전환 시 과세"
            keyPoints={[
              "스톡옵션 행사 시 과세 — 행사가격과 시가 차이에 대해 근로소득세",
              "벤처기업 스톡옵션 비과세 특례 — 연 5천만원 한도",
              "전환 시 과세 이벤트 발생 가능 — 전환가격과 시가 차이",
              "역베스팅 주식 회수 시 양도소득세 이슈",
            ]}
            impact="세무 영향을 고려하지 않고 구조를 설계하면 예상 못한 세금이 발생합니다."
          />
        </div>
      </Section>

      {/* 계약서 구조 */}
      <Section title="4. 투자계약서의 구조">
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          텀시트가 합의되면 본 계약서(신주인수계약서)로 구체화됩니다. 관련
          문서들의 관계를 이해해야 합니다.
        </p>

        <div className="space-y-3 mb-6">
          <DocCard
            title="투자조건합의서 (Term Sheet)"
            description="주요 조건 개략 합의. 법적 구속력은 비밀유지·배타적 협상 조항에만 부여."
            binding="제한적"
          />
          <DocCard
            title="신주인수계약서 (SSA)"
            description="투자의 본 계약. 투자자·회사·주요주주 3자 간 계약. 경제적 조건, 보호 조항, 의무사항 등을 포괄적으로 규정."
            binding="전면적"
          />
          <DocCard
            title="별첨2 — 우선주 조건"
            description="전환권, 상환권, 배당, Anti-dilution 등 RCPS의 경제적 권리를 구체적으로 규정. 정관 변경안과 일치해야 함."
            binding="전면적"
          />
          <DocCard
            title="별첨3 — 진술 및 보장 (R&W)"
            description="회사와 주요주주가 진술하는 11개 카테고리. DD 결과가 반영됨."
            binding="전면적"
          />
          <DocCard
            title="정관"
            description="우선주의 법적 근거. 별첨2의 내용이 정관에 반영되어야 법적 효력 발생."
            binding="상법상 효력"
          />
          <DocCard
            title="주주간계약 (SHA)"
            description="주주 간 권리·의무. 복수 투자자 참여 시 투자자 간 권리 배분 규정."
            binding="당사자 간"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>핵심:</strong> Term Sheet에서 합의된 조건이 본 계약서에
          정확히 반영되었는지 반드시 대조하세요. 밸류에이션, 전환가격,
          사전동의 항목에서 불일치가 가장 빈번합니다.
        </div>
      </Section>

      {/* 체크리스트 */}
      <Section title="5. 텀시트 검토 체크리스트">
        <div className="space-y-4">
          <Checklist
            title="경제적 조건"
            items={[
              "밸류에이션이 Pre-money인지 Post-money인지 명시되어 있는가",
              "Liquidation preference의 배수와 participating 여부가 확인되었는가",
              "Anti-dilution이 가중평균인지 full ratchet인지 명시되었는가",
              "상환권 이율과 행사 가능 시점이 합리적인가",
              "스톡옵션 풀 한도가 인재 전략에 부합하는가",
            ]}
          />
          <Checklist
            title="지배구조"
            items={[
              "사전동의 항목의 범위가 적절한가 (과도하게 넓지 않은가)",
              "이사 수 변경이 사전동의 대상에 포함되어 있는가",
              "경업금지/전업의무의 범위가 합리적인가",
              "Lock-up이 양도뿐 아니라 담보제공까지 포함하는가",
            ]}
          />
          <Checklist
            title="Exit 관련"
            items={[
              "ROFR, Tag-Along 절차와 기간이 명확한가",
              "Drag-Along이 있다면 최소 매각가격 조건이 있는가",
              "Deemed Liquidation의 경영권 이전 정의가 분할 매수를 포괄하는가",
              "IPO 추진의무 조항이 있는가",
            ]}
          />
          <Checklist
            title="보호 장치"
            items={[
              "R&W가 IP 소유권, 재무상태, 기존 계약을 커버하는가",
              "Put Option의 발동 사유와 이율이 확인되었는가",
              "선행조건(CP) 5가지가 모두 포함되어 있는가",
              "Closing 예정일이 CP 충족에 충분한 기간인가 (6~8주)",
            ]}
          />
        </div>
      </Section>

      {/* Signing → Closing */}
      <Section title="6. 투자 프로세스 타임라인">
        <div className="relative pl-8 space-y-6 mb-6">
          <TimelineItem
            title="Term Sheet 합의"
            duration="1~2주"
            description="핵심 조건 협상. 비밀유지·배타적 협상 조항만 법적 구속력."
          />
          <TimelineItem
            title="Due Diligence (실사)"
            duration="2~4주"
            description="법률·재무·사업 실사. 발견 이슈는 R&W/공개목록에 반영."
          />
          <TimelineItem
            title="계약 체결 (Signing)"
            duration="1~2주"
            description="신주인수계약서 날인. 계약 성립하나 거래 미종결."
          />
          <TimelineItem
            title="선행조건(CP) 충족"
            duration="2~4주"
            description="정관변경 주주총회, 이사회 결의, 인허가 취득 등."
          />
          <TimelineItem
            title="거래종결 (Closing)"
            duration="1일"
            description="투자금 납입, 주권 교부, 증자 등기. 투자 완료."
          />
        </div>
        <p className="text-sm text-zinc-500">
          Term Sheet부터 Closing까지 총 6~8주가 일반적입니다.
        </p>
      </Section>

      <div className="mt-12 p-4 bg-zinc-50 rounded-lg text-xs text-zinc-400">
        이 가이드는 법률 자문이 아니며, 실제 투자 계약 시 반드시 전문가(변호사,
        세무사)의 검토를 받으시기 바랍니다.
      </div>
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
    <section className="mb-14">
      <h2 className="text-lg font-semibold tracking-tight mb-5 pb-2 border-b border-zinc-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FrameCard({
  number,
  title,
  description,
  question,
  clauses,
}: {
  number: string;
  title: string;
  description: string;
  question: string;
  clauses: string[];
}) {
  return (
    <div className="border border-zinc-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-white bg-zinc-900 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
          {number}
        </span>
        <div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-sm text-zinc-500 mb-2">{description}</p>
          <p className="text-sm text-blue-600 font-medium mb-2">
            &quot;{question}&quot;
          </p>
          <div className="flex flex-wrap gap-1">
            {clauses.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  items,
}: {
  step: number;
  title: string;
  items: string[];
}) {
  return (
    <div className="border border-zinc-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-white bg-zinc-900 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
          {step}
        </span>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-zinc-600 pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-zinc-400"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LawCard({
  title,
  url,
  role,
  keyPoints,
  impact,
}: {
  title: string;
  url: string;
  role: string;
  keyPoints: string[];
  impact: string;
}) {
  return (
    <div className="border border-zinc-200 rounded-lg p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 shrink-0"
        >
          원문 ↗
        </a>
      </div>
      <p className="text-xs text-blue-600 font-medium mb-3">{role}</p>
      <ul className="space-y-1.5 mb-3">
        {keyPoints.map((point) => (
          <li
            key={point}
            className="text-xs text-zinc-500 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-zinc-300"
          >
            {point}
          </li>
        ))}
      </ul>
      <div className="bg-zinc-50 rounded-md p-2.5">
        <p className="text-xs text-zinc-600">
          <strong>실무 영향:</strong> {impact}
        </p>
      </div>
    </div>
  );
}

function DocCard({
  title,
  description,
  binding,
}: {
  title: string;
  description: string;
  binding: string;
}) {
  return (
    <div className="flex items-start gap-3 border border-zinc-200 rounded-lg p-3">
      <div className="flex-1">
        <h4 className="font-medium text-sm text-zinc-800">{title}</h4>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      </div>
      <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full shrink-0">
        {binding}
      </span>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-zinc-200 rounded-lg p-4">
      <h3 className="font-semibold text-sm mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="w-4 h-4 border-2 border-zinc-300 rounded shrink-0 mt-0.5" />
            <span className="text-zinc-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineItem({
  title,
  duration,
  description,
}: {
  title: string;
  duration: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-zinc-900 border-2 border-white" />
      <div className="absolute -left-[1.1rem] top-4 bottom-0 w-0.5 bg-zinc-200" />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
            {duration}
          </span>
        </div>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
