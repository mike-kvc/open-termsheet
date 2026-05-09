import { Clause } from "@/types/clause";

export const deemedLiquidation: Clause = {
  id: "deemed-liquidation",
  name: "Deemed Liquidation",
  name_ko: "간주청산",
  category: "exit",

  summary:
    "회사의 실제 해산·청산 없이도, M&A·영업양도·경영권 이전 등 특정 사건이 발생하면 이를 청산으로 '간주'하여 잔여재산분배 우선권을 적용하는 조항입니다. 이 조항이 없으면 M&A 대금은 단순 지분율대로만 배분되므로, 투자자 입장에서는 M&A EXIT 시 원금 우선 회수를 보장하는 핵심 장치입니다.",

  variants: [
    {
      type: "포괄적 Deemed Liquidation",
      market_position: "investor-friendly",
      description:
        "경영권에 영향을 미치는 모든 거래(지분 이전, 합병, 영업양도, 자산 매각 등)를 트리거로 설정. 범위가 넓어 창업자의 재무적 유연성을 제한합니다.",
    },
    {
      type: "제한적 Deemed Liquidation (50% 기준)",
      market_position: "neutral",
      description:
        "의결권 기준 50% 초과 지분이 이전되는 경우에만 트리거 발동. 한국 VC 시장에서 가장 일반적인 형태입니다.",
    },
    {
      type: "자산 매각 포함형",
      market_position: "investor-friendly",
      description:
        "지분 이전 외에 핵심 자산(IP, 사업부 등) 매각도 트리거에 포함. 자산 매각으로 Deemed Liquidation을 우회하는 시도를 차단합니다.",
    },
  ],

  founder_perspective: `Deemed Liquidation 조항이 있으면, M&A로 회사를 매각할 때 대금 배분 구조가 완전히 달라집니다.

예를 들어, 투자자들이 총 50억 원을 투자하고 지분 40%를 보유한 상황에서 회사가 80억 원에 매각되는 경우를 생각해 보겠습니다.

이 조항이 없으면(단순 지분 비례 배분):
- 투자자: 80억 × 40% = 32억 원
- 창업자: 80억 × 60% = 48억 원

이 조항이 있으면(Non-participating 1x 기준):
- 투자자: 50억 원 우선 회수 (원금)
- 창업자: 나머지 30억 원 배분

투자자가 Participating 조건이라면 추가 참여로 창업자 몫이 더 줄어듭니다. 매각 대금이 투자금 총합(Preference Stack)에 근접하거나 미달하면, 창업자 몫이 거의 없거나 0이 될 수 있습니다.

계약서의 '경영권 이전'과 '지분 이전'의 정의를 반드시 꼼꼼히 확인해야 합니다.`,

  investor_perspective: `Deemed Liquidation이 없으면, M&A 시 단순 지분율로만 배분됩니다. 프리밸류 높게 책정하고 들어간 경우, 지분율이 낮아 다운사이드에서 원금도 회수하지 못할 수 있습니다.

이 조항의 핵심 기능은 두 가지입니다.

첫째, M&A EXIT에서의 우선 회수: 투자금 규모가 클수록, 밸류에이션 대비 exit이 작을수록 이 조항의 가치가 커집니다.

둘째, 창업자의 저가 매각 억제: Deemed Liquidation이 있으면 창업자가 자신의 수익을 극대화하기 위해 비상식적으로 낮은 가격에 회사를 매각하기 어렵습니다. 투자자 우선 회수 후 남는 금액이 창업자 몫이기 때문입니다.

트리거 조건 설계가 핵심입니다. '일련의 거래' 합산 조항과 특수관계인 취득분 합산 조항을 반드시 포함해야 분할 매수를 통한 우회를 막을 수 있습니다.`,

  negotiation_tips: `- '경영권 이전'의 정의를 계약서에서 정확히 확인할 것 — 의결권 기준인지, 경제적 지분 기준인지, 이사 선임권 기준인지
- '일련의 거래(series of related transactions)' 합산 규정 포함 여부 확인 — 분할 매수 우회 방지
- 특수관계인 취득분 합산 조항 포함 여부 확인
- Deemed Liquidation 트리거에서 제외되어야 할 거래(IPO를 위한 지분 재편, 임직원 스톡옵션 행사 등)를 예외로 명시
- Participating 여부와 연동하여 협상 — Deemed Liquidation이 포괄적이라면 Non-participating으로 조정하는 딜도 가능`,

  examples: [
    {
      title: "Deemed Liquidation 적용 vs 미적용 시 M&A 대금 분배 비교",
      setup:
        "시리즈A 투자자: 30억 원 투자, 지분 30%. 시리즈B 투자자: 20억 원 투자, 지분 15%. 창업자 지분 55%. Preference Stack(Non-participating 1x): 총 50억 원. 회사 M&A 대금: 100억 원.",
      scenarios: [
        {
          condition: "Deemed Liquidation 없음 (단순 지분 비례)",
          investor_gets:
            "시리즈A: 100억 × 30% = 30억. 시리즈B: 100억 × 15% = 15억. 총 45억",
          founder_gets: "100억 × 55% = 55억",
        },
        {
          condition:
            "Deemed Liquidation 있음, Non-participating (1x, 시리즈B 우선)",
          investor_gets:
            "시리즈B 우선 20억, 시리즈A 우선 30억 → 투자자 총 50억. 잔여 50억을 지분율(30:15)로 배분시 추가 없음(Non-participating)",
          founder_gets:
            "잔여 50억 전액 → 55억(지분 비례) 대신 50억 수령 (창업자 -5억)",
        },
        {
          condition:
            "Deemed Liquidation 있음, Participating (1x, 잔여 지분율 재참여)",
          investor_gets:
            "우선 50억 + 잔여 50억의 45%(22.5억) = 72.5억",
          founder_gets: "잔여 50억의 55% = 27.5억 (지분 비례 55억 대비 절반)",
        },
      ],
      takeaway:
        "Deemed Liquidation이 있을 때 Non-participating은 창업자 몫이 크게 줄지 않지만, Participating까지 겹치면 창업자 몫이 절반 수준으로 줄어듭니다. 두 조항을 반드시 함께 검토해야 합니다.",
    },
    {
      title: "분할 매수로 Deemed Liquidation 트리거를 우회한 사례",
      setup:
        "투자계약상 Deemed Liquidation 트리거: '의결권 기준 50% 초과 지분의 단일 거래 이전'. 전략적 투자자 A사가 창업자 지분 49%를 먼저 인수하고, 6개월 후 추가 10%를 인수.",
      scenarios: [
        {
          condition: "1차 거래 (지분 49% 이전)",
          investor_gets: "Deemed Liquidation 미발동 — 50% 미만이므로 트리거 조건 미충족",
          founder_gets: "49% 매각 대금을 단순 수령, 투자자 우선 회수 없음",
        },
        {
          condition: "2차 거래 (추가 10% 이전, 총 59%)",
          investor_gets:
            "'일련의 거래 합산' 조항 없으면 2차 거래도 개별 거래로 처리 — Deemed Liquidation 미발동",
          founder_gets: "추가 10% 매각 대금 단순 수령",
        },
        {
          condition: "'일련의 거래 합산' 조항이 있었다면",
          investor_gets:
            "1차 거래 시점 또는 50% 초과 시점에 Deemed Liquidation 발동 → 우선 회수 권리 행사 가능",
          founder_gets: "잔여재산분배 우선권 적용 후 배분",
        },
      ],
      takeaway:
        "'경영권 이전의 정의'가 부실하면 분할 매수 구조로 Deemed Liquidation을 우회할 수 있습니다. '일련의 관련 거래' 합산 조항과 특수관계인 취득분 합산 조항을 반드시 포함해야 합니다.",
    },
  ],

  legal_check: {
    applicable_laws: [
      {
        name: "상법 제344조 (종류주식)",
        relevance:
          "잔여재산분배 우선권은 종류주식의 정관 기재 사항. Deemed Liquidation을 정관에 반영하려면 '잔여재산분배 우선권'이 M&A 등 특정 사건에도 적용됨을 정관에 명시해야 합니다.",
      },
      {
        name: "상법 제374조 (중요한 영업의 양도 등에 대한 주주총회 승인)",
        relevance:
          "영업양도·합병은 주주총회 특별결의 사항. Deemed Liquidation 트리거와 무관하게 절차적 요건이 별도로 존재합니다.",
      },
      {
        name: "자본시장과 금융투자업에 관한 법률 (자본시장법)",
        relevance:
          "상장사 또는 상장 예정 법인의 경우, 대량 주식 이전 시 공시 의무 및 공개매수 규정이 Deemed Liquidation 트리거와 병행 검토 필요.",
      },
    ],
    risk_level: "yellow",
    issues: [
      {
        type: "SHA와 정관의 불일치",
        description:
          "주주간계약(SHA)에 Deemed Liquidation을 규정하더라도, 정관의 종류주식 조항에 반영되지 않으면 실제 M&A 시 매수자 또는 법원이 SHA상 권리를 인정하지 않을 수 있습니다. 특히 합병 시 합병계약서 및 합병법인 정관과의 정합성을 확인해야 합니다.",
        recommendation:
          "Deemed Liquidation 조항은 SHA와 정관 모두에 반영. 정관 개정 없이 SHA만으로는 대외적 효력이 제한됩니다.",
      },
      {
        type: "트리거 조건의 부정확한 정의",
        description:
          "'경영권 이전'의 정의가 불명확하면 당사자 간 해석 분쟁이 발생합니다. 의결권 비율 기준, 이사 선임권 기준, 경제적 지분 기준이 혼용되면 특정 거래 구조에서 트리거 여부가 불명확해질 수 있습니다.",
        recommendation:
          "트리거 조건을 구체적으로 정의. '일련의 관련 거래 합산', '특수관계인 취득분 합산', '예외 거래 열거(IPO, ESOP 등)' 조항을 포함.",
      },
    ],
  },

  common_mistakes: [
    "Deemed Liquidation 트리거의 '경영권 이전' 정의를 꼼꼼히 검토하지 않아 분쟁 발생",
    "'일련의 거래' 합산 조항 미포함으로 분할 매수를 통한 우회 가능성을 사전에 차단하지 못함",
    "Participating 조건과 Deemed Liquidation의 조합 효과를 계산하지 않고 조항별로만 검토",
    "SHA에만 규정하고 정관에 반영하지 않아 M&A 시 대외적 효력 불확실",
    "IPO를 위한 지분 재편, ESOP 행사 등 예외 거래를 트리거에서 명시적으로 제외하지 않아 의도치 않은 발동 가능성",
  ],
};
