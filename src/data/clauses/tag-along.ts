import { Clause } from "@/types/clause";

export const tagAlong: Clause = {
  id: "tag-along",
  name: "Tag-Along (Co-Sale Right)",
  name_ko: "동반매각요구권",
  category: "exit",

  summary:
    "주요주주(창업자 등)가 보유 주식을 제3자에게 매각할 때, 투자자가 동일한 조건으로 함께 매각에 참여할 수 있는 권리입니다. 창업자만 좋은 조건에 EXIT하고 투자자는 유동성 없이 남겨지는 상황을 방지하는 핵심 EXIT 보호 장치입니다.",

  variants: [
    {
      type: "Full Tag-Along (전량 참여)",
      market_position: "investor-friendly",
      description:
        "투자자가 보유한 지분 전량을 동일 조건에 매각할 수 있습니다. 매수자가 원하는 물량을 초과할 경우 창업자와 투자자 물량을 비례 감액합니다. 투자자 보호가 가장 강한 형태입니다.",
    },
    {
      type: "Pro-rata Tag-Along (비례 참여)",
      market_position: "neutral",
      description:
        "투자자는 거래 물량 전체에서 자신의 지분 비율만큼만 참여할 수 있습니다. 창업자의 매각 계획이 과도하게 방해받지 않으므로 한국 초기 투자 시장에서 표준으로 사용됩니다.",
    },
  ],

  founder_perspective: `지분을 팔 때 투자자도 함께 팔 수 있는 권리를 갖게 되므로, 매수자가 원하는 물량(예: 창업자 지분 30%)보다 실제 매각 물량이 많아질 수 있습니다. 이 경우 매수자가 조건을 재협상하거나 딜을 철회할 수 있어 거래가 복잡해집니다.

특히 Full Tag-Along이면 투자자 전원이 전량 참여를 선언할 경우 창업자 몫이 비례 감액되는 상황도 발생합니다. ROFR 미행사 후 Tag-Along 행사까지 이어지는 총 절차 기간을 사전에 파악하고, 매수자와 기간에 대한 이해를 공유하는 것이 중요합니다.`,

  investor_perspective: `창업자가 프리미엄 가격에 구주를 매각하면서 투자자만 비유동성 상태로 남겨두는 것을 방지하는 가장 중요한 EXIT 보호 장치입니다.

ROFR을 행사하지 않더라도 Tag-Along을 통해 동일 가격·조건으로 EXIT에 참여할 수 있습니다. 신규 대주주 체제 하에서 경영 방향이 바뀌거나 IPO 계획이 변경될 위험을 감수하는 대신, Tag-Along으로 같이 나오는 것이 합리적인 선택일 수 있습니다. ROFR 미행사 후 자동으로 Tag-Along 행사 기회가 주어지도록 계약에 명시해야 효력이 있습니다.`,

  negotiation_tips: `- Full Tag-Along과 Pro-rata Tag-Along 중 어느 방식인지 반드시 명확히 기재 — 모호하면 분쟁의 원인이 됨
- Tag-Along 행사 통지 기간을 ROFR 미행사 확인 후 10~15일로 설정해 절차 전체 기간을 줄이도록 협상
- '동일 조건'의 범위 — 가격 외에 진술·보장, earn-out, 경업 금지 조건도 포함되는지 명확히
- 매수자가 특정 주주(창업자)의 지분만 원한다는 이유로 Tag-Along을 형해화하지 못하도록 '우회 매각 금지' 조항 추가`,

  examples: [
    {
      title: "Tag-Along 절차 무시 후 구주 매각 — EXIT 기회 상실 사례",
      setup:
        "스타트업 창업자가 전략적 투자자 C에게 보유 지분 35%를 400억에 매각하는 딜을 추진했습니다. 주주간계약상 투자자 D(지분 15%)의 ROFR 및 Full Tag-Along 권리가 있었으나, 창업자는 '빠른 딜 클로징'을 이유로 투자자 D에게 사전 통지 없이 양도를 완료했습니다.",
      scenarios: [
        {
          condition: "양도 완료 직후 — 법적 효력",
          investor_gets:
            "양도 자체는 유효. 투자자 D는 Tag-Along 권리를 행사할 기회를 박탈당함.",
          founder_gets:
            "400억 수령 완료. 단, 주주간계약 위반으로 투자자 D에 대해 손해배상 책임 및 Put Option 청구 리스크 발생.",
        },
        {
          condition: "신규 대주주 C의 전략 변경",
          investor_gets:
            "C가 대주주가 된 후 IPO 계획을 백지화하고 수익성 중심 구조조정 추진. 투자자 D의 EXIT 경로가 사실상 차단됨.",
          founder_gets:
            "초기 400억 확보했으나, 잔여 지분의 유동성 확보가 불투명해지고 C와 지배구조 갈등 심화.",
        },
        {
          condition: "투자자 D의 Put Option 행사",
          investor_gets:
            "주주간계약상 Tag-Along 위반을 Put Option 발동 사유로 규정한 경우, 투자자 D가 창업자 또는 회사에 지분 매수를 청구. 창업자는 예상치 못한 현금 부담 발생.",
          founder_gets:
            "딜 클로징 이후 수십억의 Put Option 청구에 직면. 빠른 딜 클로징의 이익이 법적 리스크로 상쇄됨.",
        },
      ],
      takeaway:
        "Tag-Along 절차를 무시한 채 구주 매각을 강행하면 양도 자체는 유효하지만, 계약 위반에 따른 Put Option 청구와 손해배상 리스크가 현실이 됩니다. 특히 신규 대주주의 전략 변경으로 기존 투자자의 EXIT 경로가 차단될 경우, 그 손해액이 투자 원금을 크게 초과할 수 있습니다.",
    },
  ],

  legal_check: {
    applicable_laws: [
      {
        name: "상법 제335조 (주식 양도의 자유)",
        relevance:
          "주식 양도는 원칙적으로 자유. Tag-Along 위반 시 양도 자체를 무효로 주장하기 어려우며, 계약상 손해배상 청구 또는 Put Option 행사만 가능.",
      },
      {
        name: "민법 제390조 (채무불이행 손해배상)",
        relevance:
          "Tag-Along 절차를 이행하지 않은 경우 주주간계약 위반으로 손해배상 청구의 근거가 됨. 손해액 산정은 투자자가 참여했을 경우 받았을 매각 대금을 기준으로 함.",
      },
      {
        name: "자본시장법 제148조 (대량보유 보고 의무)",
        relevance:
          "Tag-Along 행사로 주요주주 지분이 변동되는 경우 5% 이상 보유자 변동 보고 의무가 발생할 수 있음. 비상장사에는 직접 적용되지 않으나 상장 전환 시 유의.",
      },
    ],
    risk_level: "yellow",
    issues: [
      {
        type: "Tag-Along 위반 시 양도 유효성 문제",
        description:
          "Tag-Along은 주주간계약상의 의무이므로, 창업자가 절차를 무시하고 양도를 완료해도 제3자 매수인에 대한 양도 자체는 유효합니다. 투자자는 사후적으로 손해배상 청구 또는 계약서에 규정된 Put Option 행사만 가능합니다.",
        recommendation:
          "Tag-Along 위반을 Put Option 발동 사유로 명시하고, Put Option 행사 가격을 위반 시점의 공정가치 또는 해당 거래가격으로 규정해 실질적 억지력을 확보.",
      },
      {
        type: "'동일 조건' 판단의 어려움",
        description:
          "매각 조건에 진술·보장, 경업금지, earn-out 등이 포함된 경우 투자자가 '동일 조건'으로 참여하기 어렵거나 불리한 조건을 감수해야 할 수 있습니다. 특히 창업자에게만 부과되는 경업금지 조건은 투자자에게는 해당 없는 경우가 많습니다.",
        recommendation:
          "창업자에게만 적용되는 조건(경업금지, 고용 유지 의무 등)은 Tag-Along 참여 투자자에게는 면제됨을 명시. 가격 환산 기준도 사전에 합의.",
      },
    ],
  },

  common_mistakes: [
    "Full Tag-Along과 Pro-rata Tag-Along 중 어느 방식인지 명확히 하지 않아 행사 물량 관련 분쟁 발생",
    "ROFR 미행사 후 Tag-Along 행사 기간이 별도로 부여되는지를 계약에 명시하지 않아, ROFR 회신 기간 경과 후 Tag-Along도 포기된 것으로 해석되는 문제",
    "Tag-Along 행사 시 매수자가 원하는 총 물량을 초과할 경우의 비례 감액 처리 방식을 사전에 정하지 않음",
    "Tag-Along 위반 시 법적 제재(손해배상, Put Option)를 계약에 명시하지 않아 억지력 부재",
    "창업자 보유 지주회사 간 이전, 우리사주 매각 등 Tag-Along 적용 예외 거래를 열거하지 않아 불필요한 절차 부담",
  ],
};
