"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
  laws: string[];
}

const faqs: FaqItem[] = [
  {
    question: "RCPS의 상환권은 실제로 행사할 수 있나요?",
    answer:
      "법적으로는 행사 가능하나, 실무적으로는 제한적입니다. 상법 제345조에 따라 상환은 배당가능이익 범위 내에서만 가능한데, 초기 스타트업은 대부분 누적 결손금이 있어 배당가능이익이 없습니다. 따라서 상환권은 실질적인 원금 회수 수단이라기보다, 회사와 창업자에 대한 압박·협상 카드로서의 의미가 더 큽니다. 다만, 회사가 성장하여 이익잉여금이 발생한 이후에는 실효적 행사가 가능하며, IPO 준비 과정에서 상환권 포기를 요청받는 경우 이를 협상 레버리지로 활용할 수 있습니다.",
    laws: ["상법 제345조 (주식의 상환)", "벤처투자법 제50조 (벤처투자의 방법)"],
  },
  {
    question: "사전동의 사항을 회사가 사후에 알려온 경우 어떻게 대응하나요?",
    answer:
      "사전동의 없이 진행된 행위는 계약 위반이나, 상법상 해당 행위의 효력이 자동으로 무효가 되지는 않습니다. 투자자의 대응 옵션: (1) 사후 추인 — 실질적 불이익이 없다면 사후 추인하되, '이번 추인이 향후 사전동의 의무의 면제를 의미하지 않음'을 서면으로 명시. (2) 시정 요구 — 원상회복이 가능한 사항이면 시정을 요구. (3) Put Option 행사 — 중대한 위반이면 Put Option 행사를 통지하거나, 이를 협상 카드로 추가 보호 조항을 확보.",
    laws: ["상법 (이사회/주주총회 결의의 하자)", "벤처투자법 제37조 (벤처투자조합의 업무)"],
  },
  {
    question: "다운라운드(Down Round)가 발생하면 구체적으로 어떤 절차가 진행되나요?",
    answer:
      "(1) 후속 라운드의 주당 발행가가 기존 투자자의 전환가격보다 낮은지 확인합니다. (2) 가중평균 산식(NCP = OCP × (N+V)/(N+n))에 따라 조정 후 전환가격을 산출합니다. (3) 조정된 전환가격을 기존 투자자에게 서면 통지합니다. (4) Cap Table을 Fully Diluted 기준으로 업데이트합니다. (5) 정관상 전환가격 조정 조항에 따라 필요 시 정관 변경을 진행합니다. (6) 창업자에게 희석 영향을 사전에 시뮬레이션하여 공유합니다.",
    laws: [
      "상법 제346조 (전환주식)",
      "벤처투자법 제51조 (투자 조건의 공시)",
    ],
  },
  {
    question: "IPO 시 RCPS를 보통주로 전환하면 어떤 권리를 잃나요?",
    answer:
      "보통주 전환 시 RCPS의 모든 우선적 권리가 소멸합니다: 상환권(투자금 반환 청구 불가), 배당 우선권(보통주와 동일 조건), 잔여재산분배 우선권, Anti-dilution 보호. 다만, 계약상 권리(사전동의권, 정보권, Put Option 등)는 신주인수계약의 존속 여부에 따라 달라집니다. 통상 IPO 완료 시 계약이 종료되므로 대부분의 계약상 권리도 소멸하나, 비밀유지·손해배상 등 존속 조항(Survival Clause)은 유지됩니다.",
    laws: [
      "상법 제346조 (전환주식)",
      "한국채택국제회계기준(K-IFRS) 제1032호",
    ],
  },
  {
    question: "창업자가 Lock-up을 위반하여 주식을 처분한 경우 효력은?",
    answer:
      "상법 제335조의 주식 양도 자유 원칙에 의해, 계약상 Lock-up 위반만으로 양도 자체가 무효가 되지는 않을 수 있습니다. 다만: (1) 정관에 양도 제한이 있는 경우 — 이사회 승인 없는 양도는 회사에 대해 효력 없음. (2) 계약 위반으로서의 구제 — Put Option 행사, 손해배상 청구 가능. (3) 사전 예방 — 정관에 주식양도 제한 규정을 두는 것이 가장 확실한 보호 방법. 따라서 계약상 Lock-up과 함께 정관상 양도 제한을 병행 설정하는 것이 권장됩니다.",
    laws: [
      "상법 제335조 (주식의 양도성)",
      "상법 제335조의2 (주식양도의 제한)",
    ],
  },
  {
    question: "벤처투자조합(VC 펀드)의 존속기간이 만료되면 투자금은 어떻게 되나요?",
    answer:
      "벤처투자법 제69조에 따라 조합 존속기간 만료 시 해산 절차가 진행됩니다. 잔여 투자 지분은 매각하여 현금화한 후 조합원(LP)에게 분배합니다. RCPS의 존속기간(통상 10년)과 펀드 존속기간(통상 8~10년, 연장 가능)이 불일치하면 문제가 될 수 있습니다. 펀드 만료가 임박하면 투자자는 Secondary 매각, 상환권 행사, 또는 보통주 전환 후 매각을 시도합니다. 이 시기에 매도 압력이 커져 할인 매각될 수 있습니다.",
    laws: [
      "벤처투자법 제69조 (벤처투자조합의 해산)",
      "벤처투자법 제41조 (조합원에 대한 분배)",
    ],
  },
  {
    question: "RCPS의 K-IFRS 부채 분류 문제는 어떻게 해결하나요?",
    answer:
      "K-IFRS 적용 시 RCPS의 상환권 부분이 금융부채로 분류되어 부채비율이 증가합니다. 해결 방안: (1) IPO 전 상환권 포기 — 투자자가 상환권을 포기하면 자본으로 재분류. 가장 일반적인 방법. (2) CPS로 전환 — 상환권이 없는 전환우선주(CPS)로 변경. (3) 상환권 포기 대가 — 포기 시 투자자에 대한 보상(전환가격 할인, 추가 권리 부여) 협상. 실무에서는 IPO 추진이 구체화되는 시점(상장주선인 선정 후)에 협의가 이루어집니다.",
    laws: [
      "K-IFRS 제1032호 (금융상품 표시)",
      "상법 제345조 (주식의 상환)",
    ],
  },
  {
    question: "선행조건(CP) 없이 Closing해도 되나요?",
    answer:
      "권장하지 않습니다. CP 없이 납입을 진행하면, 이후 문제가 발견되었을 때 돈은 이미 나간 상태에서 협상력을 잃습니다. 대표적 사례: 정관에 우선주 조항이 반영되지 않은 상태에서 Closing을 진행하여, 투자자의 전환권·상환권이 법적 효력을 갖지 못하는 상황이 발생한 경우. Signing과 Closing을 동일자에 진행하는 '동시 Closing'의 경우에도 CP 충족 확인은 필수입니다. 정관 변경 등기가 완료되지 않은 상태에서 Closing을 진행하면 법적 리스크가 발생합니다.",
    laws: [
      "상법 (정관변경 특별결의)",
      "벤처투자법 제50조 (벤처투자의 방법)",
    ],
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-lg overflow-hidden transition-colors ${open ? "border-zinc-400" : "border-zinc-200"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-zinc-50 transition-colors"
      >
        <span className="font-medium text-sm text-zinc-800">
          {item.question}
        </span>
        <span className="text-zinc-400 text-lg shrink-0 leading-none mt-0.5">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-zinc-600 leading-relaxed mb-3">
            {item.answer}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.laws.map((law) => (
              <span
                key={law}
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
              >
                {law}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          자주 묻는 질문 (FAQ)
        </h1>
        <p className="text-zinc-500">
          벤처투자 계약에서 자주 발생하는 질문과 법률 근거를 정리했습니다.
        </p>
      </header>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <FaqAccordion key={faq.question} item={faq} />
        ))}
      </div>

      <div className="mt-12 p-4 bg-zinc-50 rounded-lg text-xs text-zinc-400">
        이 내용은 법률 자문이 아니며, 실제 투자 계약 시 반드시 전문가의 검토를
        받으시기 바랍니다.
      </div>
    </div>
  );
}
