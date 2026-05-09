import { Clause } from "@/types/clause";

export const liquidationPreference: Clause = {
  id: "liquidation-preference",
  name: "Liquidation Preference",
  name_ko: "잔여재산분배우선권",
  category: "economics",

  summary:
    "회사가 매각되거나 청산될 때, 투자자가 보통주주보다 먼저 투자금을 돌려받을 수 있는 권리입니다. 쉽게 말해 '내 돈부터 먼저 돌려줘'라는 조항입니다.",

  variants: [
    {
      type: "1x Non-participating",
      market_position: "founder-friendly",
      description:
        "투자 원금만큼 먼저 받거나, 지분 비례로 받거나 둘 중 하나를 선택. 한국 초기 투자에서 가장 일반적인 형태입니다.",
    },
    {
      type: "1x Participating (with cap)",
      market_position: "neutral",
      description:
        "투자 원금을 먼저 받고, 남은 금액에서 지분만큼 추가로 받되 상한(cap)이 있음. 투자자 보호와 창업자 인센티브 사이의 타협안입니다.",
    },
    {
      type: "1x Participating (no cap)",
      market_position: "investor-friendly",
      description:
        "투자 원금을 먼저 받고, 남은 금액에서 지분만큼 추가로 받음. 상한 없음. '이중 취식(double dip)'이라 불리며 창업자에게 불리합니다.",
    },
    {
      type: "2x 이상 Non-participating",
      market_position: "investor-friendly",
      description:
        "투자 원금의 2배 이상을 먼저 받거나, 지분 비례로 받거나 선택. exit 규모가 작을수록 창업자 몫이 크게 줄어듭니다.",
    },
  ],

  founder_perspective: `회사를 100억에 매각했는데, 정작 창업자 손에 남는 돈이 생각보다 훨씬 적을 수 있습니다. 특히 participating 조건이면 투자자가 원금 회수 후 남은 돈에서도 한 번 더 가져가기 때문입니다.

핵심은 '배수(multiple)'보다 'participating 여부'입니다. 1x participating이 2x non-participating보다 실질적으로 더 불리한 경우가 많습니다. exit 금액별로 직접 계산해 보는 게 중요합니다.`,

  investor_perspective: `투자자가 이 조항을 넣는 이유는 다운사이드 보호입니다. 프리밸류 100억에 투자했는데 회사가 50억에 매각되면, 지분 비례로만 받으면 투자금의 절반도 못 돌려받습니다.

1x non-participating이 초기 투자에서 표준인 이유: 과도한 보호 조항은 창업자의 exit 인센티브를 꺾고, 후속 투자 유치에도 걸림돌이 됩니다. 장기적으로 투자자에게도 불리한 구조입니다.

Participating을 요구하는 상황: 밸류에이션이 시장 대비 높게 책정됐을 때, 또는 후기 라운드에서 다운사이드 리스크가 클 때 타협안으로 제시합니다.`,

  negotiation_tips: `- Participating 요구를 받으면, cap(상한)을 반드시 협상하세요. 보통 투자금의 3~5배 수준
- 여러 라운드 투자자가 있을 때 각각의 liquidation preference가 누적(stacking)되는지 확인
- 시리즈가 쌓일수록 전체 preference stack이 커지므로, 초기부터 구조를 신경 써야 합니다`,

  examples: [
    {
      title: "30억 M&A — 조건별 수령액 비교",
      setup:
        "시리즈A에서 10억 투자, 지분 20% 취득 (프리밸류 40억). 회사가 30억에 매각됨 — 투자금 대비 다운사이드 시나리오.",
      scenarios: [
        {
          condition: "1x Non-participating",
          investor_gets:
            "10억(원금) vs 6억(지분 20%) 중 택 1 → 10억 선택",
          founder_gets: "나머지 20억을 보통주주끼리 배분",
        },
        {
          condition: "1x Participating (no cap)",
          investor_gets: "10억(원금) + 남은 20억의 20%(4억) = 14억",
          founder_gets: "16억 — Non-participating 대비 4억 줄어듦",
        },
        {
          condition: "2x Non-participating",
          investor_gets:
            "20억(원금x2) vs 6억(지분 20%) 중 택 1 → 20억 선택",
          founder_gets: "10억 — 매각가의 1/3만 수령",
        },
      ],
      takeaway:
        "같은 30억 exit인데 조건에 따라 창업자 몫이 20억 → 10억까지 차이납니다. 특히 exit 금액이 투자금 대비 크지 않은 경우, 조건의 영향이 극대화됩니다.",
    },
    {
      title: "200억 대형 exit — 조건 차이가 줄어드는 경우",
      setup:
        "같은 조건(10억 투자, 20% 지분)에서 회사가 200억에 매각된 경우.",
      scenarios: [
        {
          condition: "1x Non-participating",
          investor_gets:
            "10억(원금) vs 40억(지분 20%) 중 택 1 → 40억 선택 (전환)",
          founder_gets: "160억",
        },
        {
          condition: "1x Participating (no cap)",
          investor_gets: "10억 + 190억의 20%(38억) = 48억",
          founder_gets: "152억",
        },
      ],
      takeaway:
        "exit이 충분히 크면 non-participating 투자자는 보통주 전환을 선택하고, 결과적으로 차이가 줄어듭니다. Liquidation preference는 '다운사이드 보호'이지 '업사이드 극대화' 수단이 아닙니다.",
    },
  ],

  legal_check: {
    applicable_laws: [
      {
        name: "상법 제344조 (종류주식)",
        relevance:
          "잔여재산분배에 관한 우선주 발행의 법적 근거. 정관에 우선분배 내용을 명시해야 효력 발생.",
      },
      {
        name: "상법 제439조 (잔여재산의 분배)",
        relevance:
          "청산 시 잔여재산 분배 순서. 우선주의 분배 우선권은 정관 기재 사항.",
      },
      {
        name: "상법 제369조 (주주평등의 원칙)",
        relevance:
          "과도한 배수(3x 이상)는 주주평등원칙 위반으로 다툼 소지.",
      },
      {
        name: "벤처투자촉진에 관한 특별법 제41조 (조합원에 대한 분배)",
        relevance:
          "벤처투자조합이 청산 또는 투자회수 시 조합원(LP)에게 이익을 분배하는 절차를 규정합니다. 투자계약상 liquidation preference(우선분배) 구조는 조합의 분배 규정과 정합성을 갖추어야 하며, 분배 우선순위와 배율이 조합 규약상 허용 범위 내에 있어야 합니다.",
      },
      {
        name: "벤처투자촉진에 관한 특별법 제50조 (벤처투자의 방법)",
        relevance:
          "벤처투자조합이 투자자인 경우, M&A나 청산 시 잔여재산 분배는 조합의 투자금 회수 규정과 연동됩니다. 우선주·전환사채 등 투자 방식별로 분배 우선권이 달리 설계될 수 있으므로, 조합원에 대한 분배 절차 및 우선순위가 투자계약상 liquidation preference 구조와 정합성을 갖추어야 합니다.",
      },
    ],
    risk_level: "yellow",
    issues: [
      {
        type: "정관 미반영 시 효력 불확실",
        description:
          "주주간계약(SHA)에만 liquidation preference를 규정하고 정관에 반영하지 않으면, 실제 청산/매각 시 법적 효력을 주장하기 어렵습니다. 특히 M&A 시 매수자가 SHA상의 권리를 인정하지 않을 수 있습니다.",
        recommendation:
          "핵심 경제적 권리는 정관의 종류주식 조항에 반드시 반영. SHA는 정관에서 다루기 어려운 세부 사항만 보충적으로 규정.",
      },
      {
        type: "Participating 조항의 집행 가능성",
        description:
          "한국 상법은 participating liquidation preference를 명시적으로 규정하지 않습니다. '원금 우선 회수 + 잔여재산 재참여'가 정관상 종류주식으로 설계 가능한지에 대해 법률적 해석이 엇갈릴 수 있습니다.",
        recommendation:
          "법무법인을 통해 정관 설계 시 participating 구조가 상법상 유효한 형태로 기재되었는지 확인.",
      },
    ],
  },

  common_mistakes: [
    "Participating 여부를 확인하지 않고 배수(1x, 2x)만 봄 — 실질적 영향은 participating 여부가 더 큼",
    "시리즈가 쌓일 때 preference stack의 총합을 계산하지 않음 — 시리즈C까지 쌓이면 exit의 상당 부분이 투자자 우선 회수로 빠짐",
    "SHA에만 규정하고 정관에 반영하지 않아 실제 집행 시 분쟁 발생",
    "전환권(conversion right)과의 상호작용을 고려하지 않음 — non-participating에서 전환 시점과 조건이 중요",
  ],
};
